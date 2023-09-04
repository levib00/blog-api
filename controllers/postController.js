const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const Post = require('../models/post');
const Comment = require('../models/comment');

exports.AllPostsGet = asyncHandler(async (req, res, next) => {
  const posts = await Post.find();
  res.send(posts);
});

exports.PostGet = asyncHandler(async (req, res, next) => {
  res.send(await Post.findById(req.params.postId));
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
  body('isPublic'), // ! Will have to figure out how value works.

  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
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
  }),
];

exports.editPostFormGet = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.postId);
  res.format({
    html() {
      res.render('post_form', post);
    },
    json() {
      res.send(post);
    },
  });
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
  body('isPublic').escape(), // ! Will have to figure out how value works.

  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
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
  }),
];

exports.PostDelete = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.postId);
  if (post) {
    await Comment.deleteMany({ parentPost: req.params.postId });
    await Post.findByIdAndRemove(req.params.postId);
    return res.send('Comment has been deleted.');
  }
  return res.send('Comment could not be found.'); // TODO: make into real error response.
});
// TODO: figure out how to do error handling in express.
