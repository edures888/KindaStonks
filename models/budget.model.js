import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: [true, "No owner specified"],
    },
    label: {
      type: String,
      required: [true, "No label input"],
    },
    limit: {
      type: Number,
      required: [true, "No amount input"],
    },
    duration: {
      type: String,
      required: [true, "No duration input"],
    },
  },
  { timestamps: true }
);

const Budget = mongoose.model("Budget", budgetSchema);
export default Budget;
