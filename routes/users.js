const express = require('express');
const postController = require('../controllers/postController');

const router = express.Router();

router.get('/', postController.AllPostsGet);

router.get('/:postId', postController.PostGet);

module.exports = router;
