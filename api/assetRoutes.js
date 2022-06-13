import express from 'express';
import AssetController from './assetController.js';

const router = express.Router();

router
  .route('/')
  .post(AssetController.addAsset)
  .get(AssetController.getUserAssets);

router.route('/:id').delete(AssetController.deleteAsset);

export default router;
