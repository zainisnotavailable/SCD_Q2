const request = require('supertest');
const app = require('../src/app');

describe('Products API', () => {
  test('GET /api/products returns list of products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('POST /api/products creates a new product', async () => {
    const newProduct = { name: 'Test Product', price: 12.5, stock: 20 };
    const res = await request(app).post('/api/products').send(newProduct);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('name', 'Test Product');
    expect(res.body.data).toHaveProperty('price');
  });

  test('GET /api/products/:id returns 404 for missing product', async () => {
    const res = await request(app).get('/api/products/999');
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Product not found');
  });
});
