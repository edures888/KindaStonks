/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiLike from 'chai-like';
import chaiThings from 'chai-things';
import axios from 'axios';
import _ from 'lodash';
import jwtDecode from 'jwt-decode';
import { app, server } from '../server.js';
import { audience, domain } from '../utils/env.dev.js';
import { connectDB, disconnectDB } from '../utils/connectDB.js';

chai.use(chaiHttp);
const expect = chai.expect;
chai.use(chaiLike);
chai.use(chaiThings);
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

  describe('GET /api/transactions', () => {
    it('Should return empty array', async () => {
      const res = await chai
        .request(app)
        .get('/api/transactions')
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

  describe('POST /api/transactions', () => {
    it('Should add a transaction', async () => {
      const res = await chai
        .request(app)
        .post('/api/transactions')
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

  describe('GET /api/transactions', () => {
    it('Should fetch previously created transaction', async () => {
      const res = await chai
        .request(app)
        .get('/api/transactions')
        .auth(access_token, { type: 'bearer' });
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.haveOwnProperty('success');
      expect(res.body).to.property('success', true);
      expect(res.body).to.haveOwnProperty('count');
      expect(res.body).to.property('count', 1);
      expect(res.body).to.haveOwnProperty('data');
      expect(res.body)
        .to.property('data')
        .to.be.an('array')
        .that.contains.something.like({ amount: 999 });
    });
  });

  describe('DELETE /api/transactions/:id', () => {
    it('Should delete previously created transaction with given id', async () => {
      const res = await chai
        .request(app)
        .delete(`/api/transactions/${transaction_id}`)
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

  describe('POST /api/transactions/', () => {
    it('Should not create a transaction as no authorization token is provided', async () => {
      const res = await chai
        .request(app)
        .post('/api/transactions/')
        .send({ amount: 1, date: Date.now() });
      expect(res).to.have.status(401);
      expect(res.text).to.be.a('string');
      expect(res.text).to.include(
        'UnauthorizedError: No authorization token was found'
      );
    });
  });

  describe('POST /api/transactions/', () => {
    it('Should not create a transaction', async () => {
      const res = await chai
        .request(app)
        .post('/api/transactions/')
        .auth(access_token, { type: 'bearer' })
        .send({ date: Date.now() });
      expect(res).to.have.status(400);
      expect(res.text).to.be.a('string');
      expect(res.text).to.equal('Missing amount for adding Transaction');
    });
  });

  describe('DELETE /api/transactions/', () => {
    it('Should not delete note due to invalid ID', async () => {
      const res = await chai
        .request(app)
        .delete(`/api/transactions/${invalid_transaction_id}`)
        .auth(access_token, { type: 'bearer' });
      expect(res).to.have.status(500);
      expect(res.text).to.be.a('string');
      expect(res.text).to.include(
        'Error Middleware, CastError: Cast to ObjectId failed for value "101"'
      );
    });

    it('Should not delete note due to record not found', async () => {
      const res = await chai
        .request(app)
        .delete(`/api/transactions/${valid_id}`)
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
  const cost_basis = 1001;

  describe('GET /api/assets', () => {
    it('Should return empty array', async () => {
      const res = await chai
        .request(app)
        .get('/api/assets')
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

  describe('POST /api/assets', () => {
    it('Should add a asset', async () => {
      const res = await chai
        .request(app)
        .post('/api/assets')
        .auth(access_token, { type: 'bearer' })
        .send({
          user_id,
          type,
          position,
          cost_basis,
        });
      expect(res).to.have.status(200);
      expect(res.body).to.be.a('object');
      expect(res.body).to.property('user_id', user_id);
      expect(res.body).to.property('type', type);
      expect(res.body).to.property('position', position);
      asset_id = _.get(res.body, '_id');
    });
  });

  describe('GET /api/assets', () => {
    it('Should fetch previously created asset', async () => {
      const res = await chai
        .request(app)
        .get('/api/assets')
        .auth(access_token, { type: 'bearer' });
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.haveOwnProperty('success');
      expect(res.body).to.property('success', true);
      expect(res.body).to.haveOwnProperty('count');
      expect(res.body).to.property('count', 1);
      expect(res.body).to.haveOwnProperty('data');
      expect(res.body)
        .to.property('data')
        .to.be.an('array')
        .that.contains.something.like({ type, position, cost_basis });
    });
  });

  describe('DELETE /api/assets/:id', () => {
    it('Should delete previously created asset with given id', async () => {
      const res = await chai
        .request(app)
        .delete(`/api/assets/${asset_id}`)
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

  describe('POST /api/assets/', () => {
    it('Should not create a asset as no authorization token is provided', async () => {
      const res = await chai
        .request(app)
        .post('/api/assets/')
        .send({ position, type });
      expect(res).to.have.status(401);
      expect(res.text).to.be.a('string');
      expect(res.text).to.include(
        'UnauthorizedError: No authorization token was found'
      );
    });
  });

  describe('POST /api/assets/', () => {
    it('Should not create a asset due to missing field', async () => {
      const res = await chai
        .request(app)
        .post('/api/assets/')
        .auth(access_token, { type: 'bearer' })
        .send({ position });
      expect(res).to.have.status(400);
      expect(res.text).to.be.a('string');
      expect(res.text).to.equal('Missing type for adding Asset');
    });
  });

  describe('DELETE /api/assets/', () => {
    it('Should not delete asset due to invalid ID', async () => {
      const res = await chai
        .request(app)
        .delete(`/api/assets/${invalid_asset_id}`)
        .auth(access_token, { type: 'bearer' });
      expect(res).to.have.status(500);
      expect(res.text).to.be.a('string');
      expect(res.text).to.include('Error Middleware, CastError:');
    });

    it('Should not delete asset due to record not found', async () => {
      const res = await chai
        .request(app)
        .delete(`/api/assets/${valid_id}`)
        .auth(access_token, { type: 'bearer' });
      expect(res).to.have.status(404);
      expect(res.text).to.be.a('string');
      expect(res.text).to.equal('No asset found');
    });
  });
});

describe('Active Asset Positive Test Cases', () => {
  const buyPosition = 1.23;
  const doubledPosition = buyPosition * 2;
  const sellDoublePosition = -doubledPosition;
  const type = 'stocks';
  const api_id = 'AAPL';
  const name = 'Apple';
  const cost_basis = 987.65;
  const doubled_cost_basis = cost_basis * 2;

  describe('GET /api/activeAssets', () => {
    it('Should return empty array', async () => {
      const res = await chai
        .request(app)
        .get('/api/activeAssets')
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

  describe('POST /api/activeAssets', () => {
    it('Simulates buying a new asset. Should add a active asset', async () => {
      const res = await chai
        .request(app)
        .post('/api/activeAssets')
        .auth(access_token, { type: 'bearer' })
        .send({
          user_id,
          type,
          position: buyPosition,
          api_id,
          name,
          cost_basis,
        });
      expect(res).to.have.status(200);
      expect(res.body).to.be.a('object');
      expect(res.body).to.property('status', 'New active asset');
      expect(res.body).to.nested.include({ 'asset.user_id': user_id });
      expect(res.body).to.nested.include({ 'asset.type': type });
      expect(res.body).to.nested.include({ 'asset.position': buyPosition });
      expect(res.body).to.nested.include({ 'asset.cost_basis': cost_basis });
      expect(res.body).to.nested.include({ 'asset.api_id': api_id });
      expect(res.body).to.nested.include({ 'asset.name': name });
    });
  });

  describe('GET /api/activeAssets', () => {
    it('Should fetch existing active asset that was created previously', async () => {
      const res = await chai
        .request(app)
        .get('/api/activeAssets')
        .auth(access_token, { type: 'bearer' });
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.haveOwnProperty('success');
      expect(res.body).to.property('success', true);
      expect(res.body).to.haveOwnProperty('count');
      expect(res.body).to.property('count', 1);
      expect(res.body).to.haveOwnProperty('data');
      expect(res.body)
        .to.property('data')
        .to.be.an('array')
        .that.contains.something.like({
          type,
          api_id,
          name,
          user_id,
          position: buyPosition,
          cost_basis,
        });
    });
  });

  describe('POST /api/activeAssets', () => {
    it('Simulate buying more of same asset with same amount of units. Should update existing active asset and double position and cost_basis', async () => {
      const res = await chai
        .request(app)
        .post('/api/activeAssets')
        .auth(access_token, { type: 'bearer' })
        .send({
          user_id,
          type,
          position: buyPosition,
          api_id,
          name,
          cost_basis,
        });
      expect(res).to.have.status(200);
      expect(res.body).to.be.a('object');
      expect(res.body).to.property('status', 'Existing asset updated');
      expect(res.body).to.nested.include({ 'asset.user_id': user_id });
      expect(res.body).to.nested.include({ 'asset.type': type });
      expect(res.body).to.nested.include({ 'asset.position': doubledPosition });
      expect(res.body).to.nested.include({
        'asset.cost_basis': doubled_cost_basis,
      });
      expect(res.body).to.nested.include({ 'asset.api_id': api_id });
      expect(res.body).to.nested.include({ 'asset.name': name });
    });
  });

  describe('POST /api/activeAssets', () => {
    it('Simulate selling all of existing active asset. Should update existing active asset and remove active asset', async () => {
      const res = await chai
        .request(app)
        .post('/api/activeAssets')
        .auth(access_token, { type: 'bearer' })
        .send({
          user_id,
          type,
          position: sellDoublePosition,
          api_id,
          name,
          cost_basis: doubled_cost_basis,
        });
      expect(res).to.have.status(200);
      expect(res.body).to.be.a('object');
      expect(res.body).to.property(
        'status',
        'No more owned units, existing asset removed'
      );
      expect(res.body).to.nested.include({ asset: name });
    });
  });
});
