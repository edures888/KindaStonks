import express from 'express';
import ActiveAssetController from '../controllers/activeAssetController.js';

const router = express.Router();

router
  .route('/')
  .post(ActiveAssetController.updateAsset)
  .get(ActiveAssetController.getUserInventory);

router.route('/:id').delete(ActiveAssetController.deleteAsset);
router.route('/metamask').post(ActiveAssetController.updateEthereumAsset);

export default router;
