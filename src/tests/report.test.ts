import request from 'supertest';
import app from '../app'; // ודא ש־app מיוצא נכון מ־app.ts

describe('Report Routes', () => {
  it('income-vs-expense returns totals', async () => {
    const res = await request(app).get('/api/reports/income-vs-expense');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('totalIncome');
    expect(res.body).toHaveProperty('totalExpense');
  });

  it('income-analysis returns array', async () => {
    const res = await request(app).get('/api/reports/income-analysis');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('expense-analysis returns array', async () => {
    const res = await request(app).get('/api/reports/expense-analysis');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});