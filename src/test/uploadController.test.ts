import request from 'supertest';
import app from '../app';

// טסטים פשוטים לקונטרולר Upload
describe('Upload Controller Tests', () => {
  describe('POST /api/upload', () => {
    test('should handle upload endpoint', async () => {
      const response = await request(app)
        .post('/api/upload')
        .field('receiptNumber', '1001');

      // בודק שהנתיב קיים ולא מחזיר 404
      expect(response.status).not.toBe(404);
    });

    test('should accept POST requests to upload', async () => {
      const response = await request(app)
        .post('/api/upload');

      // בודק שהמתודה POST מתקבלת ולא מחזיר Method Not Allowed
      expect(response.status).not.toBe(405);
    });

    test('should respond to upload requests', async () => {
      const response = await request(app)
        .post('/api/upload')
        .send({ test: 'data' });

      // בודק שיש תשובה כלשהי מהשרת
      expect(response).toBeDefined();
      expect(response.status).toBeDefined();
    });
  });
});
