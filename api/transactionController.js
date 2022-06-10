import jwt from 'jsonwebtoken';
import Transaction from '../models/transaction.model.js';

export default class TransactionController {
  // Add a new transaction
  static async addTransaction(req, res, next) {
    const { amount, date, category, note } = req.body;
    try {
      if (!amount ) {
        res.status(400).send('Missing amount');
        return;
      }
      const newTransaction = new Transaction({
        amount, date, category, note
      });
      await newTransaction.save();
      res.status(200).send('Transaction saved');
    } catch (error) {
      res.status(500).send('Error adding transaction: ' + error.message);
      next(error);
    }
  }

  // Retrieve transaction details
  static async getTransactions(req, res, next) {
    try {
      const transactions = await Transaction.find();

      res.status(200).json({
        success: true,
        count: transactions.length, 
        data: transactions
      });
    } catch (error) {
      res.status(500).send('Error retriving transaction: ' + error.message);
      next(error);
    }
  }

  static async deleteTransaction(req, res, next) {
    try {
      const transaction = await Transaction.findById(
        req.params.id
      ).exec();
      
      if(!transaction) res.status(404).send('No transaction found');
      
      await transaction.remove();

      res.status(200).send(req.params.id + ' deleted');

    } catch (error) {
      res.status(500).send('Error deleting transaction: ' + error.message);
      next(error);
    }
  }

}