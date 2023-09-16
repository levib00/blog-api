const express = require('express');
const postController = require('../controllers/postController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.get('/', verifyToken, postController.AllPostsGet);

router.get('/:postId', verifyToken, postController.PostGet);

router.post('/', verifyToken, postController.PostPost);

router.put('/:postId/edit', verifyToken, postController.editPostPut);

router.delete('/:postId/delete', verifyToken, postController.PostDelete);

module.exports = router;
