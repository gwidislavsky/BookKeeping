import request from 'supertest';
import app from '../app';

describe('Income Routes', () => {
  it('GET /api/incomes returns array', async () => {
    const res = await request(app).get('/api/incomes');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});