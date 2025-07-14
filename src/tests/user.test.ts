import request from 'supertest';
import app from '../app';

describe('User Routes', () => {
  it('GET /api/users returns array', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});