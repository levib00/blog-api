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
  body('content', 'Title must not be empty.')
    .trim()
    .isLength({ max: 300 })
    .withMessage('Title must be less than 300 characters long.')
    .escape(),
  body('displayName', 'Message must not be empty.')
    .trim()
    .isLength({ max: 16 })
    .withMessage('message must be less than 16 characters long.')
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
      res.send(
        comment,
      );
    } else {
      // Data from form is valid. Save message.
      try {
        await comment.save();
        res.send('comment has been saved');
      } catch (error) {
        console.log(error);
      }
    }
  }),
];

exports.editCommentFormGet = asyncHandler(async(req, res, next) => {
  const comment = await Comment.findById(req.params.commentId);
  res.format({
    html() {
      res.render('comment_form', comment);
    },
    json() {
      res.send(comment);
    },
  });
});

/* exports.editCommentPut = [

  // Validate and sanitize fields.
  body('content', 'Title must not be empty.')
    .trim()
    .isLength({ max: 300 })
    .withMessage('Title must be less than 300 characters long.')
    .escape(),
  body('displayName', 'Message must not be empty.')
    .trim()
    .isLength({ max: 16 })
    .withMessage('message must be less than 16 characters long.')
    .escape(),

  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    const comment = new Comment({
      content: req.body.content,
      displayName: req.body.displayName,
      _id: req.params.commentId,
    });

    if (!errors.isEmpty()) {
      res.render('comment_form', {
        title: 'Edit Comment',
        errors: errors.array(),
        comment,
      });
    } else {
      // Data from form is valid. Save message.
      res.send(comment);
      await comment.save();
      res.redirect('/');
    }
  }),
];*/

exports.CommentDelete = asyncHandler(async (req, res, next) => {
  if (Comment.findById(req.params.commentId)) {
    await Comment.findByIdAndRemove(req.params.commentId);
    return res.send('Comment has been deleted.');
  }
  return res.send('Comment could not be found.'); // TODO: make into real error response.
});
// TODO: figure out how to do error handling in express.
