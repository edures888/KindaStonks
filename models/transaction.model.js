import mongoose from 'mongoose';

const Transaction = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, 'Please enter an amount']
    },
    date: {
      type: Date,
      default: Date.now
    },
    category: {
      type: String,
      required: false
    },
    note: {
      type: String,
      required: false
    },
  },
  { timestamps: true }
);

const transactionModel = mongoose.model('Transaction', Transaction);
export default transactionModel;
