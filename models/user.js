import mongoose, { model } from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String, required: true, minLength: 5, maxLength: 24,
  },
  password: {
    type: String, required: true, minLength: 8,
  },
});

export default model('user', UserSchema);
