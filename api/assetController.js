import Asset from '../models/asset.model.js';

export default class AssetController {
  // Add a new Asset
  static async addAsset(req, res, next) {
    const { name, symbol, api_id, user_id, position, cost_basis, type, note } =
      req.body;
    try {
      if (!position) {
        res.status(400).send('Missing position for adding Asset');
        return;
      }

      const newAsset = new Asset({
        user_id,
        name,
        symbol,
        api_id,
        position,
        cost_basis,
        type,
        note,
      });

      await newAsset.save();
      res.status(200).send('Asset saved');
    } catch (error) {
      res.status(500).send('Error adding asset: ' + error.message);
      next(error);
    }
  }

  // Get user-specific assets
  static async getUserAssets(req, res, next) {
    try {
      const { user_id } = req.body;
      const assets = await Asset.find({ user_id });
      // to be changed
      res.status(200).json({
        success: true,
        count: assets.length,
        data: assets,
      });
    } catch (error) {
      res.status(500).send('Error retriving asset: ' + error.message);
      next(error);
    }
  }

  static async deleteAsset(req, res, next) {
    try {
      const { user_id } = req.body;
      const asset = await Asset.findById(req.params.id).exec();

      if (!asset) {
        res.status(404).send('No asset found');
        return;
      }

      if (asset.user_id != user_id) {
        res.status(401).send('No permission to delete current asset');
        return;
      }

      await asset.remove();

      res.status(200).send(req.params.id + ' deleted');
    } catch (error) {
      res.status(500).send('Error deleting asset: ' + error.message);
      next(error);
    }
  }
}
