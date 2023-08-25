const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String, required: true, minLength: 5, maxLength: 24,
  },
  password: {
    type: String, required: true, minLength: 8, maxLength: 32,
  },
});

module.exports = mongoose.model('user', UserSchema);
