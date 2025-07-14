import request from 'supertest';
import app from '../app';

describe('Supplier Routes', () => {
  it('GET /api/suppliers returns array', async () => {
    const res = await request(app).get('/api/suppliers');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});