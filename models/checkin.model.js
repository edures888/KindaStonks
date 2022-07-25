import mongoose from "mongoose";

const checkinSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: [true, "No owner specified"],
    },
  },
  { timestamps: true }
);

const Checkin = mongoose.model("Checkin", checkinSchema);
export default Checkin;
