const mongoose = require('mongoose');

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

module.exports = mongoose.model('post', PostSchema);
