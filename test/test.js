/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import axios from 'axios';
import _ from 'lodash';
import jwtDecode from 'jwt-decode';
import { app, server } from '../server.js';
import { audience, domain } from '../utils/env.dev.js';
import { connectDB, disconnectDB } from '../utils/connectDB.js';

chai.use(chaiHttp);
const expect = chai.expect;
let access_token;
let user_id;

before(async () => {
  await connectDB();

  try {
    const options = {
      method: 'post',
      url: `https://${domain}/oauth/token`,
      headers: { 'content-type': 'application/json' },
      data: {
        client_id: process.env.AUTH0_TEST_CLIENT_ID,
        client_secret: process.env.AUTH0_TEST_CLIENT_SECRET,
        audience: audience,
        grant_type: 'client_credentials',
      },
    };
    const clientCredentials = await axios(options);
    access_token = clientCredentials.data.access_token;
    user_id = jwtDecode(access_token).sub;
  } catch (error) {
    console.log(error);
  }
});

after(async () => {
  disconnectDB();
  server.close();
});

describe('Transaction Positive Test Cases', () => {
  let transaction_id = ''; // Used in retrieval & deletion test
  const amount = 999;
  const date = new Date().toISOString();
  // const description = 'Note created using test';
  // const updated_title = 'Updated note from test';
  // const updated_description = 'This note is updated in test';

  describe('GET /api/v1/transactions', () => {
    it('Should return empty array', async () => {
      const res = await chai
        .request(app)
        .get('/api/v1/transactions')
        .auth(access_token, { type: 'bearer' });
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.haveOwnProperty('success');
      expect(res.body).to.property('success', true);
      expect(res.body).to.haveOwnProperty('count');
      expect(res.body).to.property('count', 0);
      expect(res.body).to.haveOwnProperty('data');
      expect(res.body).to.property('data').to.be.empty;
    });
  });

  describe('POST /api/v1/transactions', () => {
    it('Should add a transaction', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/transactions')
        .auth(access_token, { type: 'bearer' })
        .send({
          user_id,
          amount,
          date,
        });
      expect(res).to.have.status(200);
      expect(res.body).to.be.a('object');
      expect(res.body).to.property('user_id', user_id);
      expect(res.body).to.property('amount', amount);
      expect(res.body).to.property('date', date);
      transaction_id = _.get(res.body, '_id');
    });
  });

  describe('GET /api/v1/transactions', () => {
    it('Should fetch previously created transaction', async () => {
      const res = await chai
        .request(app)
        .get('/api/v1/transactions')
        .auth(access_token, { type: 'bearer' });
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.haveOwnProperty('success');
      expect(res.body).to.property('success', true);
      expect(res.body).to.haveOwnProperty('count');
      expect(res.body).to.property('count', 1);
      expect(res.body).to.haveOwnProperty('data');
      expect(res.body).to.property('data').property;
    });
  });

  describe('DELETE /api/v1/transactions/:id', () => {
    it('Should delete previously created transaction with given id', async () => {
      const res = await chai
        .request(app)
        .delete(`/api/v1/transactions/${transaction_id}`)
        .auth(access_token, { type: 'bearer' });
      expect(res).to.have.status(200);
      expect(res.text).to.be.a('string');
      expect(res.text).to.equal(`${transaction_id} deleted`);
    });
  });
});

describe('Transaction Negative Test Cases', () => {
  const invalid_transaction_id = '101'; // Not a valid ObjectID
  const valid_id = '62b8b40fec8e53c86677135d'; // Valid ObjectId but no such record in the DB

  describe('GET /details, Authentication Check', () => {
    it('Should return unauthorised error', async () => {
      const res = await chai.request(app).get('/details');
      expect(res).to.have.status(401);
      expect(res.text).to.be.a('string');
      expect(res.text).to.include(
        'UnauthorizedError: No authorization token was found'
      );
    });
  });

  describe('POST /api/v1/transactions/', () => {
    it('Should not create a transaction as no authorization token is provided', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/transactions/')
        .send({ amount: 1, date: Date.now() });
      expect(res).to.have.status(401);
      expect(res.text).to.be.a('string');
      expect(res.text).to.include(
        'UnauthorizedError: No authorization token was found'
      );
    });
  });

  describe('POST /api/v1/transactions/', () => {
    it('Should not create a transaction', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/transactions/')
        .auth(access_token, { type: 'bearer' })
        .send({ date: Date.now() });
      expect(res).to.have.status(400);
      expect(res.text).to.be.a('string');
      expect(res.text).to.equal('Missing amount for adding Transaction');
    });
  });

  describe('DELETE /api/v1/transactions/', () => {
    it('Should not delete note due to invalid ID', async () => {
      const res = await chai
        .request(app)
        .delete(`/api/v1/transactions/${invalid_transaction_id}`)
        .auth(access_token, { type: 'bearer' });
      expect(res).to.have.status(500);
      expect(res.text).to.be.a('string');
      expect(res.text).to.include('Error deleting transaction:');
    });

    it('Should not delete note due to record not found', async () => {
      const res = await chai
        .request(app)
        .delete(`/api/v1/transactions/${valid_id}`)
        .auth(access_token, { type: 'bearer' });
      expect(res).to.have.status(404);
      expect(res.text).to.be.a('string');
      expect(res.text).to.equal('No transaction found');
    });
  });
});

describe('Asset Positive Test Cases', () => {
  let asset_id = ''; // Used in retrieval & deletion test
  const position = 999;
  const type = 'stocks';
  // const description = 'Note created using test';
  // const updated_title = 'Updated note from test';
  // const updated_description = 'This note is updated in test';

  describe('GET /api/v1/assets', () => {
    it('Should return empty array', async () => {
      const res = await chai
        .request(app)
        .get('/api/v1/assets')
        .auth(access_token, { type: 'bearer' });
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.haveOwnProperty('success');
      expect(res.body).to.property('success', true);
      expect(res.body).to.haveOwnProperty('count');
      expect(res.body).to.property('count', 0);
      expect(res.body).to.haveOwnProperty('data');
      expect(res.body).to.property('data').to.be.empty;
    });
  });

  describe('POST /api/v1/assets', () => {
    it('Should add a asset', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/assets')
        .auth(access_token, { type: 'bearer' })
        .send({
          user_id,
          type,
          position,
        });
      expect(res).to.have.status(200);
      expect(res.body).to.be.a('object');
      expect(res.body).to.property('user_id', user_id);
      expect(res.body).to.property('type', type);
      expect(res.body).to.property('position', position);
      asset_id = _.get(res.body, '_id');
    });
  });

  describe('GET /api/v1/assets', () => {
    it('Should fetch previously created asset', async () => {
      const res = await chai
        .request(app)
        .get('/api/v1/assets')
        .auth(access_token, { type: 'bearer' });
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.haveOwnProperty('success');
      expect(res.body).to.property('success', true);
      expect(res.body).to.haveOwnProperty('count');
      expect(res.body).to.property('count', 1);
      expect(res.body).to.haveOwnProperty('data');
      expect(res.body).to.property('data').property;
    });
  });

  describe('DELETE /api/v1/assets/:id', () => {
    it('Should delete previously created asset with given id', async () => {
      const res = await chai
        .request(app)
        .delete(`/api/v1/assets/${asset_id}`)
        .auth(access_token, { type: 'bearer' });
      expect(res).to.have.status(200);
      expect(res.text).to.be.a('string');
      expect(res.text).to.equal(`${asset_id} deleted`);
    });
  });
});

describe('Asset Negative Test Cases', () => {
  const invalid_asset_id = '101'; // Not a valid ObjectID
  const valid_id = '62b8b40fec8e53c86677135d'; // Valid ObjectId but no such record in the DB
  const position = 999;
  const type = 'stocks';

  describe('POST /api/v1/assets/', () => {
    it('Should not create a asset as no authorization token is provided', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/assets/')
        .send({ position, type });
      expect(res).to.have.status(401);
      expect(res.text).to.be.a('string');
      expect(res.text).to.include(
        'UnauthorizedError: No authorization token was found'
      );
    });
  });

  describe('POST /api/v1/assets/', () => {
    it('Should not create a asset', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/assets/')
        .auth(access_token, { type: 'bearer' })
        .send({ position });
      expect(res).to.have.status(400);
      expect(res.text).to.be.a('string');
      expect(res.text).to.equal('Missing type for adding Asset');
    });
  });

  describe('DELETE /api/v1/assets/', () => {
    it('Should not delete asset due to invalid ID', async () => {
      const res = await chai
        .request(app)
        .delete(`/api/v1/assets/${invalid_asset_id}`)
        .auth(access_token, { type: 'bearer' });
      expect(res).to.have.status(500);
      expect(res.text).to.be.a('string');
      expect(res.text).to.include('Error deleting asset:');
    });

    it('Should not delete asset due to record not found', async () => {
      const res = await chai
        .request(app)
        .delete(`/api/v1/assets/${valid_id}`)
        .auth(access_token, { type: 'bearer' });
      expect(res).to.have.status(404);
      expect(res.text).to.be.a('string');
      expect(res.text).to.equal('No asset found');
    });
  });
});
