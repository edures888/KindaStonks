import express from 'express';
import ActiveAssetController from '../controllers/activeAssetController';

const router = express.Router();

router
  .route('/')
  .post(ActiveAssetController.updateAsset)
  .get(ActiveAssetController.getUserInventory);

router.route('/:id').delete(ActiveAssetController.deleteAsset);

export default router;
