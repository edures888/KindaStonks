import axios from 'axios';
import ActiveAsset from '../models/activeAsset.model.js';
import { alphaAPIKey } from '../utils/env.dev.js';

export default class ActiveAssetController {
  // Adds a new Active Asset if it doesnt already exist in user inventory
  // Else updates currently existing active asset
  static async updateAsset(req, res, next) {
    try {
      const {
        name,
        symbol,
        api_id,
        user_id,
        position,
        cost_basis,
        date,
        type,
      } = req.body;

      if (!position) {
        res.status(400).send('Missing position for adding Asset');
        return;
      }
      if (!type) {
        res.status(400).send('Missing type for adding Asset');
        return;
      }
      if (!cost_basis) {
        res.status(400).send('Missing cost basis for adding Asset');
        return;
      }

      const existingAsset = await ActiveAsset.findOne({
        name,
        symbol,
        api_id,
        user_id,
      }).exec();

      /* If there is existing asset, update position, cost_basis, last_updated and current_note.
      Additionally, if position hits <= 0, existing asset is removed instead
      Else, create a new active asset to be part of inventory  */
      let updateResult = {};
      if (!existingAsset) {
        const newAsset = new ActiveAsset(req.body);
        await newAsset.save();
        updateResult.asset = newAsset;
        updateResult.status = 'New active asset';
      } else {
        existingAsset.position += position;
        if (existingAsset.position <= 0) {
          await existingAsset.remove();
          updateResult.asset = name;
          updateResult.status = 'No more owned units, existing asset removed';
        } else {
          existingAsset.cost_basis =
            position < 0
              ? existingAsset.cost_basis - cost_basis
              : existingAsset.cost_basis + cost_basis;
          existingAsset.date = date;
          await existingAsset.save();
          updateResult.asset = existingAsset;
          updateResult.status = 'Existing asset updated';
        }
      }
      res.status(200).json(updateResult);
    } catch (error) {
      // res.status(500).send('Error updating active asset: ' + error.message);
      next(error);
    }
  }

  // Get user-specific active assets, or inventory list
  // Post-Milestone 3: Includes Market API querying
  static async getUserInventory(req, res, next) {
    try {
      const { user_id } = req.body;
      // lean() for assets to be raw JSON object, instead of Mongoose Document
      const assets = await ActiveAsset.find({ user_id }).lean();
      let fetchSuccess = true;

      // Price fetching for all assets
      await Promise.all(
        assets.map(async (asset) => {
          // Convert Date object in date to String
          asset.date = asset.date.toISOString();

          if (asset.type === 'stocks') {
            await axios
              .get(
                `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${asset.symbol}&apikey=${alphaAPIKey}`
              )
              .then((res) => {
                if (!res.data['Global Quote']) {
                  asset.price = NaN;
                } else {
                  asset.price = res.data['Global Quote']['05. price'];
                }
              })
              .catch((err) => {
                console.log(err);
                fetchSuccess = false;
              });
            // Possible use better error handling
          } else {
            await axios
              .get(
                `https://api.coingecko.com/api/v3/coins/${asset.api_id}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false`
              )
              .then((res) => {
                asset.price = res.data.market_data.current_price.sgd;
              })
              .catch((err) => {
                console.log(err);
                fetchSuccess = false;
              });
          }
        })
      );
      // If any price fetching returns empty data
      if (!fetchSuccess) {
        res
          .status(500)
          .send(
            'Error retrieving inventory: ' +
              'Unable to retrieve current price from Stock/Crypto APIs'
          );
      }

      res.status(200).json({
        success: true,
        count: assets.length,
        data: assets,
      });
    } catch (error) {
      // res.status(500).send('Error retriving inventory: ' + error.message);
      next(error);
    }
  }

  static async deleteAsset(req, res, next) {
    try {
      const { user_id } = req.body;
      const activeAsset = await ActiveAsset.findById(req.params.id).exec();

      if (!activeAsset) {
        res.status(404).send('No asset found');
        return;
      }

      if (activeAsset.user_id != user_id) {
        res.status(401).send('No permission to delete current active asset');
        return;
      }

      await activeAsset.remove();

      res.status(200).send(req.params.id + ' active asset deleted');
    } catch (error) {
      // res.status(500).send('Error deleting active asset: ' + error.message);
      next(error);
    }
  }
}
