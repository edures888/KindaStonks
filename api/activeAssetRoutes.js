import express from 'express';
import ActiveAssetController from './activeAssetController.js';

const router = express.Router();

router
  .route('/')
  .post(ActiveAssetController.updateAsset)
  .get(ActiveAssetController.getUserInventory);

router.route('/:id').delete(ActiveAssetController.deleteAsset);

export default router;
