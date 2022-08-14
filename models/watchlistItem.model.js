import mongoose from 'mongoose';

const watchlistItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    symbol: {
      type: String,
    },
    api_id: {
      type: String,
    },
    user_id: {
      type: String,
      required: [true, 'No owner specified'],
    },
    type: {
      type: String,
      required: [true, 'No type specified'],
    },
  },
  { timestamps: true }
);
const WatchlistItem = mongoose.model('WatchlistItem', watchlistItemSchema);
export default WatchlistItem;
