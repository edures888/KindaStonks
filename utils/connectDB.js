import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { nodeEnv, databaseURI } from './env.dev.js';

let mongod;
let dbUrl;

/**
 * Establish connection to MongoDB
 */
const connectDB = async () => {
  if (nodeEnv == 'test') {
    mongod = await MongoMemoryServer.create();
    dbUrl = mongod.getUri();
  } else {
    dbUrl = databaseURI;
  }
  mongoose
    .connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB Connection Success'))
    .catch((error) => {
      console.log('MongoDB Connection Failed', error);
      process.exit();
    });
};

/**
 * Diconnect from MongoDB
 */
const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    if (mongod) {
      await mongod.stop();
    }
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

export { connectDB, disconnectDB };
