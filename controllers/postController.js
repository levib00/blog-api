const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const Post = require('../models/post');
const Comment = require('../models/comment');
require('dotenv').config();

exports.AllPostsGet = asyncHandler(async (req, res) => {
  let posts;
  jwt.verify(req.token, process.env.JWT_SECRET, async (err) => {
    if (err) {
      posts = await Post.find({ isPublic: true });
    } else {
      posts = await Post.find();
    }
    res.send(posts);
  });
});

exports.PostGet = asyncHandler(async (req, res) => {
  let post = await Post.find({ isPublic: true, _id: req.params.postId });
  jwt.verify(req.token, process.env.JWT_SECRET, async (err) => {
    if (post.length > 0) {
      res.send(post);
    } else if (err) {
      res.status(404).send('This post does not exist or you do not have access to it');
    } else {
      post = await Post.findById(req.params.postId);
      if (post.length < 1) {
        res.status(404).send('This post does not exist or you do not have access to it');
      } else {
        res.send(post);
      }
    }
  });
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

  asyncHandler(async (req, res) => {
    // Extract the validation errors from a request.
    jwt.verify(req.token, process.env.JWT_SECRET, async (err) => {
      if (err) {
        res.status(401).send('You must be logged in as an admin to post.');
      } else {
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
          // Data from form is valid. Save post.
          try {
            await post.save();
            res.send('post has been saved');
          } catch (error) {
            res.send(error);
          }
        }
      }
    });
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

  asyncHandler(async (req, res) => {
    jwt.verify(req.token, process.env.JWT_SECRET, async (err) => {
      if (err) {
        res.status(401).send('You must be logged in as an admin to edit a post.');
      } else {
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
          // Data from form is valid. Save post.
          try {
            try {
              await Post.findByIdAndUpdate(req.params.postId, post, {});
              res.send({ post, msg: 'post has been updated.' });
            } catch (error) {
              res.send(error);
            }
          } catch (error) {
            res.send(error);
          }
        }
      }
    });
  }),
];

exports.PostDelete = asyncHandler(async (req, res) => {
  jwt.verify(req.token, process.env.JWT_SECRET, async (err) => {
    const post = await Post.findById(req.params.postId);
    if (err) {
      res.status(401).send('You must be logged in as an admin to delete a post.');
    } else if (post) {
      await Comment.deleteMany({ parentPost: req.params.postId });
      await Post.findByIdAndRemove(req.params.postId);
      res.send('Comment has been deleted.');
    } else {
      res.status(404).send('This post was not found');
    }
  });
});
