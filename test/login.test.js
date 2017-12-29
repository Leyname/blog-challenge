const mocha = require('mocha');
const supertest = require('supertest');

const {
  expect,
} = require('chai');
const app = require('../index');
const users = require('../models/user');

const request = supertest(app);

const db = require('../common/db');

const {
  describe,
  it,
  before,
  after,
} = mocha;

describe('test login', () => {
  before(() => db.authenticate());

  before('create confirmed usermail@gmail.com', async () => {
    const userdata = {
      first_name: 'user',
      last_name: 'last_name_user',
      password: 'testing1234',
      email: 'usermail@gmail.com',
    };
    const { id } = await users.addNewUser(userdata);
    await users.confirmUser(id);
  });

  before('create unconfirmed nonconfirmedmail@gmail.com', async () => {
    const userdata = {
      first_name: 'unconfirmeduser',
      last_name: 'last_name_unconfirmeduser',
      password: 'testing1234',
      email: 'nonconfirmedmail@gmail.com',
    };
    await users.addNewUser(userdata);
  });

  after('delete confirmed usermail@gmail.com', () => {
    users.deleteUserByEmail('usermail@gmail.com');
  });

  after('delete unconfirmed nonconfirmedmail@gmail.com', () => {
    users.deleteUserByEmail('nonconfirmedmail@gmail.com');
  });

  it('succesful login', () => (
    request
      .post('/api/auth/login')
      .send({
        email: 'usermail@gmail.com',
        password: 'testing1234',
      })
      .expect((res) => {
        expect(res.body.success).to.equals(true);
        expect(res.body).to.have.property('token');
      })

  ));

  it('fail login: user is not found', () => (
    request
      .post('/api/auth/login')
      .send({
        email: 'notusermail@gmail.com',
        password: 'testing1234',
      })
      .expect((res) => {
        expect(res.body.success).to.equals(false);
        expect(res.body.message).to.equals('user is not found');
      })

  ));

  it('fail login: email is not confirmed', () => (
    request
      .post('/api/auth/login')
      .send({
        email: 'nonconfirmedmail@gmail.com',
        password: 'testing1234',
      })
      .expect((res) => {
        expect(res.body.success).to.equals(false);
        expect(res.body.message).to.equals('email is not confirmed');
      })

  ));

  it('fail login: password is not entered correcty', () => (
    request
      .post('/api/auth/login')
      .send({
        email: 'usermail@gmail.com',
        password: 'nonrightpassword',
      })
      .expect((res) => {
        expect(res.body.success).to.equals(false);
        expect(res.body.message).to.equals('user or password are not entered correctly');
      })

  ));

  it('fail login: email is not entered', () => (
    request
      .post('/api/auth/login')
      .send({
        password: 'testing1234',
      })
      .expect((res) => {
        expect(res.body.success).to.equals(false);
        expect(res.body.message).to.equals('not all data is entered');
      })

  ));

  it('fail login: password is not entered', () => (
    request
      .post('/api/auth/login')
      .send({
        email: 'usermail@gmail.com',
      })
      .expect((res) => {
        expect(res.body.success).to.equals(false);
        expect(res.body.message).to.equals('not all data is entered');
      })

  ));
});

