const express = require('express');
const commentController = require('../controllers/commentController');
const verifyToken = require('../middleware/verifyToken')

const router = express.Router();

router.get('/', commentController.AllCommentsGet);

router.get('/:postId', commentController.PostPageCommentsGet);

router.get('/:commentId', commentController.CommentGet);

router.post('/', commentController.CommentPost);

router.delete('/:commentId/delete', verifyToken, commentController.CommentDelete);

module.exports = router;
