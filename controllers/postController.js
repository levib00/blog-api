import { body, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';
import Post from '../models/post';

export const AllPostsGet = asyncHandler(async (req, res, next) => {
  res.send(Post.find());
});

export const PostGet = asyncHandler(async (req, res, next) => {
  res.send(Post.findById(req.params.postId));
});

export const PostPost = [

  // Validate and sanitize fields.
  body('title', 'Post content must not be empty.')
    .trim()
    .isLength({ max: 16 })
    .withMessage('Title must be less than 16 characters long.')
    .escape(),
  body('content', 'content must not be empty.')
    .trim()
    .isLength({ min: 3 })
    .withMessage('message must be less than 300 characters long.')
    .escape(),
  body('isPublic').escape(), // ! Will have to figure out how value works.

  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    const post = new Post({
      content: req.body.content,
      displayName: req.body.displayName,
      timeStamp: Date.now(),
    });

    if (!errors.isEmpty()) {
      res.render('log-in', {
        title: 'Log-in',
        errors: errors.array(),
        post,
      });
    } else {
      // Data from form is valid. Save message.
      res.send(post);
      await post.save();
      res.redirect('/');
    }
  }),
];

export const CommentDelete = asyncHandler(async (req, res, next) => {
  if (Post.findById(req.params.commentId)) {
    Comment.findByIdAndRemove(req.params.commentId);
    return res.send('Comment has been deleted.');
  }
  return res.send('Comment could not be found.'); // TODO: make into real error response.
});
// TODO: figure out how to do error handling in express.
