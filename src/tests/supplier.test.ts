import request from 'supertest';
import app from '../app';

describe('Supplier Routes', () => {
  let createdId: string;

  it('GET /api/suppliers returns array', async () => {
    const res = await request(app).get('/api/suppliers');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/suppliers creates a supplier', async () => {
    const res = await request(app)
      .post('/api/suppliers')
      .send({ name: 'נתן' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    createdId = res.body._id;
  });

  it('GET /api/suppliers/:id returns a supplier', async () => {
    const res = await request(app).get(`/api/suppliers/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('_id', createdId);
  });

  it('PUT /api/suppliers/:id updates a supplier', async () => {
    const res = await request(app)
      .put(`/api/suppliers/${createdId}`)
      .send({ name: 'לוי' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('name', 'לוי');
  });

  it('DELETE /api/suppliers/:id deletes a supplier', async () => {
    const res = await request(app).delete(`/api/suppliers/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
  });
});