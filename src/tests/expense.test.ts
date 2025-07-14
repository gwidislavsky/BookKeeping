import request from 'supertest';
import app from '../app';

describe('Expense Routes', () => {
  it('GET /api/expenses returns array', async () => {
    const res = await request(app).get('/api/expenses');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});