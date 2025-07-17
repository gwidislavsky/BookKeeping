import request from 'supertest';
import app from '../app';

describe('Report Routes', () => {
  it('GET /api/reports/income-vs-expense returns totals', async () => {
    const res = await request(app).get('/api/reports/income-vs-expense');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('totalIncome');
    expect(res.body).toHaveProperty('totalExpense');
  });

  it('GET /api/reports/income-analysis returns array', async () => {
    const res = await request(app).get('/api/reports/income-analysis');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/reports/expense-analysis returns array', async () => {
    const res = await request(app).get('/api/reports/expense-analysis');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});