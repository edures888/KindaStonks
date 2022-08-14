import Transaction from '../models/transaction.model.js';

export default class TransactionController {
  // Add a new transaction
  static async addTransaction(req, res, next) {
    const { user_id, label, amount, date, category } = req.body;
    try {
      if (!amount) {
        res.status(400).send('Missing amount for adding Transaction');
        return;
      }

      if (!date) {
        res.status(400).send('Missing date for adding Transaction');
        return;
      }

      const newTransaction = new Transaction({
        user_id,
        label,
        amount,
        date,
        category,
        
      });

      await newTransaction.save();
      res.status(200).json(newTransaction);
    } catch (error) {
      // res.status(500).send('Error adding transaction: ' + error.message);
      next(error);
    }
  }

  // Retrieve ALL transaction details
  static async getAllTransactions(req, res, next) {
    try {
      const transactions = await Transaction.find();

      res.status(200).json({
        success: true,
        count: transactions.length,
        data: transactions,
      });
    } catch (error) {
      // res.status(500).send('Error retriving transaction: ' + error.message);
      next(error);
    }
  }

  // Get user-specific transactions
  static async getUserTransactions(req, res, next) {
    try {
      const { user_id } = req.body;
      const transactions = await Transaction.find({ user_id });

      res.status(200).json({
        success: true,
        count: transactions.length,
        data: transactions,
      });
    } catch (error) {
      // res.status(500).send('Error retriving transaction: ' + error.message);
      next(error);
    }
  }

  static async deleteTransaction(req, res, next) {
    try {
      const { user_id } = req.body;
      const transaction = await Transaction.findById(req.params.id).exec();

      if (!transaction) {
        res.status(404).send('No transaction found');
        return;
      }

      if (transaction.user_id != user_id) {
        res.status(401).send('No permission to delete current transaction');
        return;
      }

      await transaction.remove();

      res.status(200).send(req.params.id + ' deleted');
    } catch (error) {
      // res.status(500).send('Error deleting transaction: ' + error.message);
      next(error);
    }
  }
}
