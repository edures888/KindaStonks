import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: [true, 'No owner specified'],
    },
    amount: {
      type: Number,
      required: [true, 'No amount input'],
    },
    date: {
      type: Date,
      default: Date.now,
      required: [true, 'No date input'],
    },
    category: {
      type: String,
      required: false,
    },
    note: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
