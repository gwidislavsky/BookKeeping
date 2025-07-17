import request from 'supertest';
import app from '../app';

describe('Income Routes', () => {
  let createdId: string;

  it('GET /api/incomes returns array', async () => {
    const res = await request(app).get('/api/incomes');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/incomes creates an income', async () => {
    const res = await request(app)
      .post('/api/incomes')
      .send({ amount: 100, client: 'עקיבא', date: new Date(), vat: 0, paymentMethod: 'cash' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    createdId = res.body._id;
  });

  it('GET /api/incomes/:id returns an income', async () => {
    const res = await request(app).get(`/api/incomes/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('_id', createdId);
  });

  it('PUT /api/incomes/:id updates an income', async () => {
    const res = await request(app)
      .put(`/api/incomes/${createdId}`)
      .send({ amount: 200 });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('amount', 200);
  });

  it('DELETE /api/incomes/:id deletes an income', async () => {
    const res = await request(app).delete(`/api/incomes/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
  });
});