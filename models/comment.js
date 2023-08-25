const mongoose = require('mongoose');

const { Schema } = mongoose;

const CommentSchema = new Schema({
  content: {
    type: String, required: true, minLength: 3, maxLength: 300,
  },
});

// Export model.
module.exports = mongoose.model('comment', CommentSchema);
