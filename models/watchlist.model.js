import mongoose from 'mongoose';

const watchlistSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: [true, 'No owner specified'],
    },
    list: {
      type: [{ apiIdentifier: String, assetType: String }],
    },
  },
  { timestamps: true }
);

const Watchlist = mongoose.model('Watchlist', watchlistSchema);
export default Watchlist;
