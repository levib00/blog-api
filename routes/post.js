const express = require('express');
const postController = require('../controllers/postController');

const router = express.Router();

router.get('/', postController.AllPostsGet);

router.get('/:postId', postController.PostGet);

router.post('/', postController.PostPost);

router.put('/:postId/edit', postController.editPostPut);

router.delete('/:postId/delete', postController.PostDelete);

module.exports = router;
