import app from '../../src/server';
import supertest from 'supertest';
import { User } from '../../src/models/user';

const request = supertest(app);

let token: string;
const user: User = {
  firstName: 'test-firstname',
  lastName: 'test-lastname',
  username: 'test-username',
  password: 'test-password'
};

describe('Test all users endpoints', () => {
  it('Create a new user', async () => {
    const response = await request.post('/users').send(user);
    token = 'Bearer ' + response.body;
    expect(response.status).toBe(200);
  });

  it('Authenticate an existing user', async () => {
    const response = await request
      .post('/users/authenticate').set('Authorization', token)
      .send({ username: user.username, password: user.password });
    
    expect(response.status).toBe(200);
  });

  it('Get all users', async () => {
    const response = await request.get('/users')
      .set('Authorization', token)
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('Get a user with a specified id', async () => {
    const response = await request.get('/users/1')
      .set('Authorization', token);
    expect(response.status).toBe(200);
    expect(response.body.username).toEqual('test-username');
  });

  it('Allows user to update password', async () => {
    const response = await request.put('/users/1')
      .set('Authorization', token)
      .send({ username: 'test-username', password: 'test-password' });
    expect(response.status).toBe(200);
  });

  it('Allows removal of an existing user', async () => {
    const response = await request.delete('/users')
      .send({ username: user.username })
      .set('Authorization', token);
    console.log(response.body);
    expect(response.body.length).toBeLessThan(1);
  });
});

describe('Test all products endpoints', () => {
  it('Retrieve all products', async () => {
    const response = await request.get('/products');
    expect(response.status).toBe(200);
  });

  it('Retrieve a product with a specified id', async () => {
    const response = await request.get('/products/1');
    expect(response.status).toBe(200);
  });

  it('Create a new product', async () => {
    const response = await request.post('/products')
      .set('Authorization', token)
      .send({ name: 'Dog toy', price: 10 });
    expect(response.status).toBe(200);
  });
});

describe('Test all orders endpoints', () => {
  it('Retrieve all orders', async () => {
    const response = await request.get('/orders');
    expect(response.status).toBe(200);
  });

  it('Retrieve an order of a specified id', async () => {
    const response = await request.get('/orders/1');
    expect(response.status).toBe(200);
  });

  it('Create a new order', async () => {
    await request.post('/users').send(user);
    const response = await request.post('/orders')
      .set('Authorization', token)
      .send({ userId: '2', status: 'open' });
    expect(response.status).toBe(200);
  });

  it('Add a new product to an order', async () => {
    const response = await request.post('/orders/1/products')
      .set('Authorization', token)
      .send({ quantity: 10, productId: '1' });
    expect(response.status).toBe(200);
  });
});

describe('Test all dashboard endpoints', () => {
  it('Get all the products in orders', async () => {
    const response = await request.get('/products-in-orders')
      .set('Authorization', token);
    expect(response.status).toBe(200);
  });

  it('Get all the users with orders', async () => {
    const response = await request.get('/users-with-orders')
      .set('Authorization', token);
    expect(response.status).toBe(200);
  });

  it('Sort five most expensive products', async () => {
    const response = await request.get('/five-most-expensive');
    expect(response.body.length).toBeLessThanOrEqual(5);
  });

  it('Retrieve an order from a specified user id', async () => {
    const response = await request.get('/current-order/1')
      .set('Authorization', token);
    expect(response.status).toBe(200);
  });
});
