import { body, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';
import Comment from '../models/comment';

export const AllCommentsGet = asyncHandler(async (req, res, next) => {
  res.send(Comment.find());
});

export const CommentGet = asyncHandler(async (req, res, next) => {
  res.send(Comment.findById(req.params.commentId));
});

export const CommentPost = [

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
      timeStamp: Date.now(),
    });

    if (!errors.isEmpty()) {
      res.render('log-in', {
        title: 'Log-in',
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
];

export const editCommentFormGet = asyncHandler(async(req, res, next) => {
  const comment = Comment.findById(req.params.commentId);
  res.format({
    html() {
      res.render('comment_form', comment);
    },
    json() {
      res.send(comment);
    },
  });
});

export const editCommentPut = [

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
];

export const CommentDelete = asyncHandler(async (req, res, next) => {
  if (Comment.findById(req.params.commentId)) {
    Comment.findByIdAndRemove(req.params.commentId);
    return res.send('Comment has been deleted.');
  }
  return res.send('Comment could not be found.'); // TODO: make into real error response.
});
// TODO: figure out how to do error handling in express.
