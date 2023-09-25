const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const Comment = require('../models/comment');

exports.AllCommentsGet = asyncHandler(async (req, res, next) => {
  res.send(await Comment.find());
});

exports.PostPageCommentsGet = asyncHandler(async (req, res, next) => {
  const comments = await Comment.find({ parentPost: req.params.postId }).exec();
  res.send(comments);
});

exports.CommentGet = asyncHandler(async (req, res, next) => {
  res.send(await Comment.findById(req.params.commentId));
});

exports.CommentPost = [

  // Validate and sanitize fields.
  body('content', 'Comment must not be empty.')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Comment must be at least 3 characters long.')
    .isLength({ max: 300 })
    .withMessage('Comment must be less than 300 characters long.')
    .escape(),
  body('displayName', 'Display name must not be empty.')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Display name must be at least 3 characters long.')
    .isLength({ max: 16 })
    .withMessage('Display name must be less than 16 characters long.')
    .escape(),
  body('parentPost')
    .escape(),

  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    const comment = new Comment({
      parentPost: req.body.parentPost,
      content: req.body.content,
      displayName: req.body.displayName,
      timestamp: Date.now(),
    });

    if (!errors.isEmpty()) {
      res.status(422).send({
        comment,
        errors: errors.array(),
      });
    } else {
      try {
        await comment.save();
        res.send('comment has been saved');
      } catch (error) {
        res.status(500).send({ msg: 'something went wrong' });
      }
    }
  }),
];

exports.CommentDelete = asyncHandler(async (req, res, next) => {
  if (Comment.findById(req.params.commentId)) {
    await Comment.findByIdAndRemove(req.params.commentId);
    return res.send('Comment has been deleted.');
  }
  return res.status(404).send('Comment could not be found.');
});
