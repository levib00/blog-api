import mongoose, { model } from 'mongoose';

const { Schema } = mongoose;

const PostSchema = new Schema({
  title: {
    type: String, required: true,
  },
  content: {
    type: String, required: true,
  },
  timestamp: {
    type: Number, required: true,
  },
  isPublic: {
    type: Boolean, required: true,
  },
});

export default model('post', PostSchema);
