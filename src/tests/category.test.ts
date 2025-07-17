import request from 'supertest';
import app from '../app';

describe('Category Routes', () => {
  let createdId: string;

  it('GET /api/categories returns array', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/categories creates a category', async () => {
    const res = await request(app)
      .post('/api/categories')
      .send({ name: 'נקיון' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    createdId = res.body._id;
  });

  it('GET /api/categories/:id returns a category', async () => {
    const res = await request(app).get(`/api/categories/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('_id', createdId);
  });

  it('PUT /api/categories/:id updates a category', async () => {
    const res = await request(app)
      .put(`/api/categories/${createdId}`)
      .send({ name: 'נקיון' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('name', 'נקיון');
  });

  it('DELETE /api/categories/:id deletes a category', async () => {
    const res = await request(app).delete(`/api/categories/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
  });
});