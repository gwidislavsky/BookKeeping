import request from 'supertest';
import app from '../app';

describe('Category Routes', () => {
  it('GET /api/categories returns array', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});