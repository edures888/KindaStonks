import mongoose from "mongoose";

const Transaction = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: [true, "No owner specified"],
    },
    amount: {
      type: Number,
      required: [true, "No amount input"],
    },
    date: {
      type: Date,
      default: Date.now,
      required: [true, "No date input"],
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

const transactionModel = mongoose.model("Transaction", Transaction);
export default transactionModel;
