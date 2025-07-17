import request from 'supertest';
import app from '../app';

describe('Expense Routes', () => {
  let createdId: string;

  it('GET /api/expenses returns array', async () => {
    const res = await request(app).get('/api/expenses');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/expenses creates an expense', async () => {
    const res = await request(app)
      .post('/api/expenses')
      .send({ amount: 100, category: 'נקיון', supplier: 'נתן', date: new Date(), vat: 0, paymentMethod: 'cash' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    createdId = res.body._id;
  });

  it('GET /api/expenses/:id returns an expense', async () => {
    const res = await request(app).get(`/api/expenses/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('_id', createdId);
  });

  it('PUT /api/expenses/:id updates an expense', async () => {
    const res = await request(app)
      .put(`/api/expenses/${createdId}`)
      .send({ amount: 200 });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('amount', 200);
  });

  it('DELETE /api/expenses/:id deletes an expense', async () => {
    const res = await request(app).delete(`/api/expenses/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
  });
});