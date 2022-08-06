import WatchlistItem from '../../models/watchlistItem.model';

export default class WatchlistController {
  // Add a new Asset
  static async addItem(req, res, next) {
    const { name, symbol, api_id, user_id, type } = req.body;
    try {
      if (!type) {
        res.status(400).send('Missing type for adding item to Watchlist');
        return;
      }

      const newItem = new WatchlistItem({
        user_id,
        name,
        symbol,
        api_id,
        type,
      });

      await newItem.save();
      res.status(200).json(newItem);
    } catch (error) {
      // res.status(500).send('Error adding asset: ' + error.message);
      next(error);
    }
  }

  // Get user-specific assets
  static async getWatchlist(req, res, next) {
    try {
      const { user_id } = req.body;
      const list = await WatchlistItem.find({ user_id });
      
      // fetch from external API
      
      res.status(200).json({
        success: true,
        count: list.length,
        data: list,
      });
    } catch (error) {
      // res.status(500).send('Error retriving asset: ' + error.message);
      next(error);
    }
  }

  static async deleteItem(req, res, next) {
    try {
      const { user_id } = req.body;
      const item = await WatchlistItem.findById(req.params.id).exec();

      if (!item) {
        res.status(404).send('No watchlist item found');
        return;
      }

      if (item.user_id != user_id) {
        res.status(401).send('No permission to delete current asset');
        return;
      }

      await item.remove();

      res.status(200).send(req.params.id + ' deleted');
    } catch (error) {
      // res.status(500).send('Error deleting asset: ' + error.message);
      next(error);
    }
  }
}
