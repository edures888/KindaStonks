import mongoose from 'mongoose';

const Asset = new mongoose.Schema(
  {
    name: {
      type: String
    },
    symbol: {
      type: String
    },
    api_id: {
      type: String
    },
    user_id: {
      type: String,
      required: [true, 'No owner specified'],
    },
    position: {
      type: Number,
      required: [true, 'Please enter position'],
    },
    cost_basis: {
      type: String
    },
    date: {
      type: Date,
      default: Date.now,
    },
    type: {
      type: String,
      required: [true, 'No type specified'],
    },
    note: {
      type: String,
    },
  },
  { timestamps: true }
);

const assetModel = mongoose.model('Asset', Asset);
export default assetModel;
