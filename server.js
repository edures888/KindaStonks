import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import activeAssetRouter from './api/routes/activeAssetRoutes.js';
import assetRouter from './api/routes/assetRoutes.js';
import checkinRouter from './api/routes/checkinRoutes.js';
import streakRouter from './api/routes/streakRoutes.js';
import transactionRouter from './api/routes/transactionRoutes.js';
import watchlistItemRouter from './api/routes/watchlistRoutes.js';
import errorMiddleware from './middleware/errorMiddleware.js';
import jwtCheck from './middleware/jwtCheck.js';
import userMiddleware from './middleware/userMiddleware.js';
import { connectDB } from './utils/connectDB.js';
import { clientOriginUrl, nodeEnv, serverPort } from './utils/env.dev.js';

// Connect to MongoDB, if not testing
if (nodeEnv != 'test') connectDB();

/* App configuration */
const app = express();
app.use(helmet());
app.use(cors({ origin: clientOriginUrl }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Index Endpoint
app.get('/', (req, res) => {
  res.json({ message: 'KindaStonksAPI' });
});

// Validate access tokens to protect the following routes
app.use(jwtCheck);

// Sample protected route
app.get('/details', async (req, res, next) => {
  try {
    res.status(200).json({ message: 'This is protected info' });
  } catch (error) {
    next(error);
  }
});

// Routes for Transaction, Asset and Active Assets API, includes usage of userMiddleware
app.use('/api/transactions', userMiddleware, transactionRouter);
app.use('/api/streak', userMiddleware, streakRouter);
app.use('/api/checkin', userMiddleware, checkinRouter);
app.use('/api/assets', userMiddleware, assetRouter);
app.use('/api/activeAssets', userMiddleware, activeAssetRouter);
app.use('/api/watchlist', userMiddleware, watchlistItemRouter);

// Basic error middleware
app.use(errorMiddleware);

// Listen to corresponding port once done
const server = app.listen(serverPort, () =>
  console.log(`Server running on port ${serverPort}`)
);

export { app, server };
