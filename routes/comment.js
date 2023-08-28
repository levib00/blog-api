import { Router } from 'express';
import * as commentController from '../controllers/commentController';

const router = Router();

router.get('/', commentController.AllCommentsGet);

router.get('/:commentId', commentController.CommentGet);

router.post('/', commentController.CommentPost);

router.put('/:commentId/edit', commentController.editCommentPut);

router.delete('/:commentId', commentController.CommentDelete);

export default router;
