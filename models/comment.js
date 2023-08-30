const mongoose = require('mongoose');

const { Schema } = mongoose;

const CommentSchema = new Schema({
  parentPost: {
    type: Schema.ObjectId, ref: 'post', required: true,
  },
  content: {
    type: String, required: true, minLength: 3, maxLength: 300,
  },
  displayName: {
    type: String, required: true, minLength: 3, maxLength: 16,
  },
  timestamp: {
    type: Number, required: true,
  },
});

// Export model.
module.exports = mongoose.model('Comment', CommentSchema);
