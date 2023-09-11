const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const Post = require('../models/post');
const Comment = require('../models/comment');

exports.AllPostsGet = asyncHandler(async (req, res, next) => {
  let posts;

  if (req.user) { // TODO: replace req.user with jwt for authorization uses.
    posts = await Post.find();
  } else {
    posts = await Post.find({ isPublic: true });
  }
  res.send(posts);
});

exports.PostGet = asyncHandler(async (req, res, next) => {
  let post;
  const isAuthenticated = !!req.user;
  if (isAuthenticated) {
    post = await Post.findById(req.params.postId);
  } else {
    post = await Post.find({ isPublic: true, _id: req.params.postId });
  }
  res.send({ post, isAuthenticated });
});

exports.PostPost = [
  // Validate and sanitize fields.
  body('title', 'Post content must not be empty.')
    .trim()
    .isLength({ max: 48 })
    .withMessage('Title must be less than 16 characters long.')
    .escape(),
  body('content', 'content must not be empty.')
    .trim()
    .escape(),
  body('isPublic'),

  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    if (res.locals.currentUser) {
      const errors = validationResult(req);

      const post = new Post({
        content: req.body.content,
        title: req.body.title,
        timestamp: Date.now(),
        isPublic: req.body.isPublic,
      });

      if (!errors.isEmpty()) {
        console.log(errors);
        res.send({
          errors: errors.array(),
          post,
        });
      } else {
        // Data from form is valid. Save message.
        try {
          console.log('fsdaf');
          await post.save();
          res.send('post has been saved');
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      console.log(res.locals.currentUser);
      res.status(401).send('You must be logged in as an admin to post.');
    }
  }),
];

exports.editPostFormGet = asyncHandler(async (req, res, next) => {
  if (req.user) {
    const post = await Post.findById(req.params.postId);
    res.send(post);
  }
});

exports.editPostPut = [

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
  body('isPublic').escape(),

  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    if (req.user) {
      const errors = validationResult(req);

      const post = new Post({
        content: req.body.content,
        displayName: req.body.displayName,
        _id: req.params.commentId,
      });

      if (!errors.isEmpty()) {
        res.send({
          errors: errors.array(),
          post,
        });
      } else {
        // Data from form is valid. Save message.
        res.send(post);
        await post.save();
        res.redirect('/');
      }
    }
  }),
];

exports.PostDelete = asyncHandler(async (req, res, next) => {
  if (req.user) {
    const post = await Post.findById(req.params.postId);
    if (post) {
      await Comment.deleteMany({ parentPost: req.params.postId });
      await Post.findByIdAndRemove(req.params.postId);
      return res.send('Comment has been deleted.');
    }
    return res.send('Comment could not be found.');
  }// TODO: make into real error response.
});
