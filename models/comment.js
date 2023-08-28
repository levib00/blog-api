import mongoose, { model } from 'mongoose';

const { Schema } = mongoose;

const CommentSchema = new Schema({
  content: {
    type: String, required: true, minLength: 3, maxLength: 300,
  },
  displayName: {
    type: String, required: true, minLength: 3, maxLength: 16,
  },
  timeStamp: {
    type: Number, required: true,
  },
});

// Export model.
export default model('Comment', CommentSchema);
