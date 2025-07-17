import request from 'supertest';
import app from '../app';
import path from 'path';

describe('Upload Route', () => {
  it('POST /api/upload uploads a PDF and returns data', async () => {
    const res = await request(app)
      .post('/api/upload')
      .attach('file', path.join(__dirname, 'sample.pdf')); // ודא שיש sample.pdf בתיקיית הבדיקות
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('allText');
  });
});