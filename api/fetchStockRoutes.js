import axios from 'axios';
import express from 'express';
import { alphaAPIKey } from '../utils/env.dev.js';

const router = express.Router();

router.route('/:symbol').get(async (req, res, next) => {
  try {
    const symbol = req.params.symbol;
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${alphaAPIKey}`
    );
    if (!response.data) {
      res
        .status(503)
        .send('Unable to retrieve current price from AlphaVantage');
    }
    res.status(200).json(response.data['Global Quote']['05. price']);
  } catch (error) {
    next(error);
  }
});

export default router;
