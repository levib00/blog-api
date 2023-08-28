import asyncHandler from 'express-async-handler';
import Comment from '../models/comment';

const UserGet = asyncHandler(async (req, res, next) => {
  res.send(Comment.findById(req.params.commentId));
});

export default UserGet;
