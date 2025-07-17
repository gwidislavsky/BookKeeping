import request from 'supertest';
import app from '../app';

describe('Receipt Routes', () => {
  // יש להניח שיש קבלה קיימת במסד הנתונים עם id מתאים לבדיקה אמיתית
  it('GET /api/receipts/:id/pdf returns a PDF', async () => {
    // שים כאן id אמיתי של קבלה קיימת, או צור קבלה לפני הבדיקה
    const receiptId = 'ID_HERE';
    const res = await request(app).get(`/api/receipts/${receiptId}/pdf`);
    // אם אין קבלה, אמור לקבל 404
    if (res.status === 404) {
      expect(res.body).toHaveProperty('error');
    } else {
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toBe('application/pdf');
    }
  });
});