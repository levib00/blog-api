const { body, validationResult } = require('express-validator'); // Importing express-validator for validating request bodies
const asyncHandler = require('express-async-handler'); // Importing express-async-handler for handling asynchronous functions in routes
const Post = require('../models/post'); // Importing the Post model
const Comment = require('../models/comment'); // Importing the Comment model
require('dotenv').config(); // Importing dotenv for environment variables

// Route handler for getting all posts
exports.AllPostsGet = asyncHandler(async (req, res) => {
  let posts;
  // If user is not logged in, only show public posts
  if (req.user === null) {
    posts = await Post.find({ isPublic: true });
  } else {
    posts = await Post.find(); // Otherwise, show all posts
  }
  res.send(posts);
});

// Route handler for getting a single post by ID
exports.PostGet = asyncHandler(async (req, res) => {
  let post = await Post.find({ isPublic: true, _id: req.params.postId });
  // Show the post if it's public or the user has access to it
  if (post.length > 0) {
    res.send(post);
  } else if (req.user === null) {
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

// Route handler for posting a new post
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
    if (req.user === null) {
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
  }),
];

// Route handler for editing a post
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
    if (req.user === null) {
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
        // Data from form is valid. Update post.
        try {
          await Post.findByIdAndUpdate(req.params.postId, post, {});
          res.send({ post, msg: 'post has been updated.' });
        } catch (error) {
          res.send(error);
        }
      }
    }
  }),
];

// Route handler for deleting a post
exports.PostDelete = asyncHandler(async (req, res) => {
  // Delete the selected post and all child comments.
  const post = await Post.findById(req.params.postId);
  if (req.user === null) {
    res.status(401).send('You must be logged in as an admin to delete a post.');
  } else if (post) {
    await Comment.deleteMany({ parentPost: req.params.postId });
    await Post.findByIdAndRemove(req.params.postId);
    res.send('Post and its comments have been deleted.');
  } else {
    res.status(404).send('This post was not found');
  }
});
