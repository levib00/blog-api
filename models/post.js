const mongoose = require('mongoose')

const { Schema } = mongoose;

const PostSchema = new Schema({
  content: {
    type: String, required: true,
  },
  title: {
    type: String, required: true,
  },
  timestamp: {
    type: Number, required: true,
  },
});

module.exports = mongoose.model('post', PostSchema);
