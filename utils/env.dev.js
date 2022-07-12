/* eslint-disable no-undef */
import dotenv from 'dotenv';

/**
 * Setup environment variables for app configuration
 */
dotenv.config();

const nodeEnv = process.env.NODE_ENV;
const audience = process.env.AUTH0_AUDIENCE;
const domain = process.env.AUTH0_DOMAIN;
const serverPort = process.env.PORT;
const clientOriginUrl =
  nodeEnv === 'development'
    ? process.env.DEV_CLIENT_ORIGIN_URL
    : process.env.PROD_CLIENT_ORIGIN_URL;
const databaseURI = process.env.DB_URI;
const alphaAPIKey = process.env.ALPHA_KEY;

if (!audience) {
  throw new Error(
    '.env is missing the definition of an AUTH0_AUDIENCE environmental variable'
  );
}

if (!domain) {
  throw new Error(
    '.env is missing the definition of an AUTH0_DOMAIN environmental variable'
  );
}

if (!clientOriginUrl) {
  throw new Error(
    '.env is missing the definition of a APP_ORIGIN environmental variable'
  );
}

if (!databaseURI) {
  throw new Error(
    '.env is missing the definition of a DB_URI environmental variable'
  );
}

if (!alphaAPIKey) {
  throw new Error(
    '.env is missing the definition of a ALPHA_KEY environmental variable'
  );
}

export {
  nodeEnv,
  audience,
  domain,
  serverPort,
  clientOriginUrl,
  databaseURI,
  alphaAPIKey,
};
