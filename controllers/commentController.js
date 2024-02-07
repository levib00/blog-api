const { body, validationResult } = require('express-validator'); // Importing express-validator for validating request bodies
const asyncHandler = require('express-async-handler'); // Importing express-async-handler for handling asynchronous functions in routes
const Comment = require('../models/comment'); // Importing the Comment model

// Route handler for getting all comments
exports.AllCommentsGet = asyncHandler(async (req, res) => {
  res.send(await Comment.find()); // Sending all comments found in the database
});

// Route handler for getting comments of a specific post
exports.PostPageCommentsGet = asyncHandler(async (req, res) => {
  // Finding comments associated with a specific post ID
  const comments = await Comment.find({ parentPost: req.params.postId }).exec();
  res.send(comments); // Sending the found comments
});

// Route handler for getting a single comment by ID
exports.CommentGet = asyncHandler(async (req, res) => {
  res.send(await Comment.findById(req.params.commentId)); // Finding and sending a comment by its ID
});

// Route handler for posting a new comment
exports.CommentPost = [
  // Validation and sanitization of request body fields
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

  // Route handler for processing the request after validation and sanitization
  asyncHandler(async (req, res) => {
    // Extract the validation errors from the request
    const errors = validationResult(req);

    // Creating a new comment object with data from the request body
    const comment = new Comment({
      parentPost: req.body.parentPost,
      content: req.body.content,
      displayName: req.body.displayName,
      timestamp: Date.now(),
    });

    // Checking for validation errors
    if (!errors.isEmpty()) {
      res.status(422).send({
        comment,
        errors: errors.array(),
      });
    } else {
      try {
        await comment.save(); // Saving the new comment to the database
        res.send('comment has been saved'); // Sending a success message
      } catch (error) {
        res.status(500).send({ msg: 'something went wrong' }); // Sending an error message if something goes wrong
      }
    }
  }),
];

// Route handler for deleting a comment by ID
exports.CommentDelete = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId); // Finding the comment by its ID

  // Checking if the comment exists
  if (comment) {
    await Comment.findByIdAndRemove(req.params.commentId); // Removing the comment from the database
    return res.send('Comment has been deleted.'); // Sending a success message
  }
  return res.status(404).send('Comment could not be found.'); // Sending a not found message if the comment does not exist
});
