import request from 'supertest';
import app from '../app';

describe('Client Routes', () => {
    let createdId: string;
  it('GET /api/clients returns array', async () => {
    const res = await request(app).get('/api/clients');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

 it('POST /api/clients creates a client', async () => {
    const res = await request(app)
      .post('/api/clients')
      .send({ name: 'יעקב', email: 'jakob@gmail.com' }); 
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    createdId = res.body._id;
  });

  it('GET /api/clients/:id returns a client', async () => {
    const res = await request(app).get(`/api/clients/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('_id', createdId);
  });

  it('PUT /api/clients/:id updates a client', async () => {
    const res = await request(app)
      .put(`/api/clients/${createdId}`)
      .send({ name: 'דן' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('name', 'דן');
  });

  it('DELETE /api/clients/:id deletes a client', async () => {
    const res = await request(app).delete(`/api/clients/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
  });
});