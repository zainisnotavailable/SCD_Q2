const request = require('supertest');
const app = require('../src/app');

describe('Users API', () => {
  test('GET /api/users returns list of users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.count).toBeGreaterThanOrEqual(1);
  });

  test('GET /api/users/:id returns a single user for valid id', async () => {
    const res = await request(app).get('/api/users/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id', 1);
    expect(res.body.data).toHaveProperty('email');
  });

  test('GET /api/users/:id returns 404 for non-existing user', async () => {
    const res = await request(app).get('/api/users/999');
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('User not found');
  });
});
