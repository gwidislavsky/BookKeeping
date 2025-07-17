import request from 'supertest';
import app from '../app';

describe('User Routes', () => {
  let createdId: string;

  it('GET /api/users returns array', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/users creates a user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'גיל', email: 'g5566@gmail.com' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    createdId = res.body._id;
  });

  it('GET /api/users/:id returns a user', async () => {
    const res = await request(app).get(`/api/users/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('_id', createdId);
  });

  it('PUT /api/users/:id updates a user', async () => {
    const res = await request(app)
      .put(`/api/users/${createdId}`)
      .send({ name: 'מן' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('name', 'מן');
  });

  it('DELETE /api/users/:id deletes a user', async () => {
    const res = await request(app).delete(`/api/users/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
  });
});