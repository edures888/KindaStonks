import jwt from 'jsonwebtoken';
import Transaction from '../models/transaction.model.js';

export default class TransactionController {
  // Add a new transaction
  static async addTxn(req, res, next) {
    const { amount, date, category, notes } = req.body;
    try {
      if (!amount || !date ) {
        res.status(400).send('Missing fields for transaction');
        return;
      }
      const newTxn = new Transaction({
        amount, date, category, notes
      });
      await newTxn.save();
      res.status(200).send('Transaction saved');
    } catch (error) {
      res.status(500).send('Error adding transaction: ' + error.message);
      next(error);
    }
  }

  // Retrieve transaction details
  static async getTxns(req, res, next) {
    try {
      const txns = await Transaction.find();

      res.status(200).json({
        success: true,
        count: txns.length, 
        data: txns
      });
    } catch (error) {
      res.status(500).send('Error retriving transaction:' + error.message);
      next(error);
    }
  }

  static async deleteTxn(req, res, next) {
    try {
      const { _id } = await Transaction.findById(
        req.txn.id
      ).exec();
      res.status(200).json({
        amount, date, category, notes
      });
    } catch (error) {
      res.status(500).send('Error retriving transaction:' + error.message);
      next(error);
    }
  }

}