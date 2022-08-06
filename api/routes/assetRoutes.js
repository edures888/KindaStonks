import express from 'express';
import AssetController from '../controllers/assetController';

const router = express.Router();

router
  .route('/')
  .get(AssetController.getUserHistory)
  .post(AssetController.addAsset);

router.route('/:id').delete(AssetController.deleteAsset);

export default router;
