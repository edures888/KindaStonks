import express from 'express';
import WatchlistController from '../controllers/watchlistController.js';

const router = express.Router();

router
  .route('/')
  .get(WatchlistController.getWatchlist)
  .post(WatchlistController.addItem);

router.route('/:id').delete(WatchlistController.deleteItem);

export default router;
