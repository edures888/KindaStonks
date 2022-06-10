import mongoose from 'mongoose';

const User = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please enter username'],
      unique: [true, 'Username has already been taken'],
    },
    email: {
      type: String,
      required: [true, 'Please enter email'],
      unique: [true, 'Email has already been registered'],
    },
    password: { type: String, required: [true, 'Please enter password'] },
    name: { type: String, default: '' },
  },
  { timestamps: true }
);

const userModel = mongoose.model('User', User);
export default userModel;
