const request = require('supertest');
const app = require('../src/app');

describe('Orders API', () => {
  test('POST /api/orders creates a new order (happy path)', async () => {
    const payload = { userId: 1, productId: 1, quantity: 1 };
    const res = await request(app).post('/api/orders').send(payload);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data).toHaveProperty('total');
  });

  test('POST /api/orders returns 400 for insufficient stock', async () => {
    // productId 2 has stock 3 in the orders route; request more than that
    const payload = { userId: 1, productId: 2, quantity: 100 };
    const res = await request(app).post('/api/orders').send(payload);
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Insufficient stock');
  });

  test('GET /api/orders/user/:userId returns orders for a user', async () => {
    // Ensure at least one order exists for user 1 (first test created one)
    const res = await request(app).get('/api/orders/user/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
