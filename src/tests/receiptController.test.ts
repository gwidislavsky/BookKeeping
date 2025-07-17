import { downloadReceiptPdf } from '../controllers/Receipt';
import { Receipt } from '../models/Receipt';

jest.mock('../models/Receipt');

describe('Receipt Controller', () => {
  it('downloadReceiptPdf returns 404 if not found', async () => {
    (Receipt.findById as jest.Mock).mockResolvedValue(null);
    const req = { params: { id: '1' } } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), setHeader: jest.fn(), pipe: jest.fn() } as any;
    await downloadReceiptPdf(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Receipt not found' });
  });

  // בדיקה ל-200 אפשרית, אך דורשת מוקים ל-PDFDocument ול-res.pipe
});