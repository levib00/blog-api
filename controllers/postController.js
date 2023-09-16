const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const Post = require('../models/post');
const Comment = require('../models/comment');

exports.AllPostsGet = asyncHandler(async (req, res, next) => {
  let posts;
  if (req.token) {
    posts = await Post.find();
  } else {
    posts = await Post.find({ isPublic: true });
  }
  res.send(posts);
});

exports.PostGet = asyncHandler(async (req, res, next) => {
  let post = await Post.find({ isPublic: true, _id: req.params.postId });
  if (req.token) {
    post = await Post.findById(req.params.postId);
  } else if (!post) {
    res.status(404).send('This post does not exist or you do not have access to it');
  }
  res.send(post);
});

exports.PostPost = [
  // Validate and sanitize fields.
  body('title', 'Post content must not be empty.')
    .trim()
    .isLength({ max: 48 })
    .withMessage('Title must be less than 48 characters long.')
    .escape(),
  body('content', 'content must not be empty.')
    .trim()
    .escape(),
  body('isPublic'),

  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    if (typeof req.token !== 'undefined') {
      const errors = validationResult(req);

      const post = new Post({
        content: req.body.content,
        title: req.body.title,
        timestamp: Date.now(),
        isPublic: req.body.isPublic,
      });

      if (!errors.isEmpty()) {
        res.status(422).send({
          errors: errors.array(),
          post,
        });
      } else {
        // Data from form is valid. Save message.
        try {
          await post.save();
          res.send('post has been saved');
        } catch (error) {
          res.send(error);
        }
      }
    } else {
      res.status(401).send('You must be logged in as an admin to post.');
    }
  }),
];

exports.editPostPut = [

  // Validate and sanitize fields.
  body('title', 'Post content must not be empty.')
    .trim()
    .isLength({ max: 48 })
    .withMessage('Title must be less than 48 characters long.')
    .escape(),
  body('content', 'content must not be empty.')
    .trim()
    .escape(),
  body('isPublic'),

  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
    console.log(req.body)
    // Extract the validation errors from a request.
    if (req.token) {
      const errors = validationResult(req);

      const post = new Post({
        content: req.body.content,
        title: req.body.title,
        isPublic: req.body.isPublic,
        timestamp: req.body.timestamp,
        _id: req.params.postId,
      });

      if (!errors.isEmpty()) {
        res.status(422).send({
          errors: errors.array(),
          post,
        });
      } else {
        // Data from form is valid. Save message.
        try {
          await Post.findByIdAndUpdate(req.params.postId, post, {});
          res.send({ post, msg: 'post has been updated.' });
        } catch (error) {
          res.send(error);
        }
      }
    } else {
      res.status(401).send('You must be logged in as an admin to edit a post.');
    }
  }),
];

exports.PostDelete = asyncHandler(async (req, res, next) => {
  if (req.token) {
    const post = await Post.findById(req.params.postId);
    if (post) {
      await Comment.deleteMany({ parentPost: req.params.postId });
      await Post.findByIdAndRemove(req.params.postId);
      res.send('Comment has been deleted.');
    } else {
      res.status(404).send('This post was not found');
    }
  } else {
    res.status(401).send('You must be logged in as an admin to delete a post.');
  }
});
