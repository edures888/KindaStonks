import dotenv from 'dotenv';

/**
 * Setup environment variables for app configuration
 */
dotenv.config();

const nodeEnv = process.env.NODE_ENV;
const audience = process.env.AUTH0_AUDIENCE;
const domain = process.env.AUTH0_DOMAIN;
const serverPort = process.env.PORT;
const clientOriginUrl = nodeEnv === 'development' ? process.env.CLIENT_ORIGIN_URL : 'https://client-stonks.vercel.app/';
const databaseURI = process.env.DB_URI;

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

const clientOrigins = nodeEnv === 'development' ? ['http://localhost:3000'] : ['https://client-stonks-staging.vercel.app/']

export {
  audience,
  domain,
  serverPort,
  clientOriginUrl,
  clientOrigins,
  databaseURI,
};
