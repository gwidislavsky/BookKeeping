import request from 'supertest';
import app from '../app';

describe('Client Routes', () => {
  it('GET /api/clients returns array', async () => {
    const res = await request(app).get('/api/clients');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});