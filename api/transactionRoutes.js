import express from 'express';
import TransactionController from './transactionController.js';
import jwtCheck from '../middleware/jwtCheck.js';

const router = express.Router();

router
  .route('/')
  .post(TransactionController.addTransaction)
  .get(TransactionController.getUserTransactions);

// Only for testing, not user-protected
router.route('/all').get(TransactionController.getAllTransactions);

router.route('/:id').delete(TransactionController.deleteTransaction);

export default router;
