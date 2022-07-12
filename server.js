import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { connectDB } from './utils/connectDB.js';
import transactionRouter from './api/transactionRoutes.js';
import streakRouter from './api/streakRoutes.js'
import assetRouter from './api/assetRoutes.js';
import activeAssetRouter from './api/activeAssetRoutes.js';
import errorMiddleware from './middleware/errorMiddleware.js';
import { clientOriginUrl, nodeEnv, serverPort } from './utils/env.dev.js';
import jwtCheck from './middleware/jwtCheck.js';
import userMiddleware from './middleware/userMiddleware.js';

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
    res.status(500).send('Error retriving user details' + error.message);
  }
});

// Routes for Transaction & Asset API, includes usage of userMiddleware
app.use('/api/transactions', userMiddleware, transactionRouter);
app.use('/api/streak', userMiddleware,streakRouter);
app.use('/api/assets', userMiddleware, assetRouter);
app.use('/api/activeAssets', userMiddleware, activeAssetRouter);

// Basic error middleware
app.use(errorMiddleware);

// Listen to corresponding port once done
const server = app.listen(serverPort, () =>
  console.log(`Server running on port ${serverPort}`)
);

export { app, server };
