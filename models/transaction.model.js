import mongoose from 'mongoose';

const Transaction = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: [true, 'No owner specified'],
    },
    amount: {
      type: Number,
      required: [true, 'Please enter an amount'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    category: {
      type: String,
      required: false,
    },
    note: {
      type: String,
    },
  },
  { timestamps: true }
);

const transactionModel = mongoose.model('Transaction', Transaction);
export default transactionModel;
