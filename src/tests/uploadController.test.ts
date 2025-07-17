import { uploadFile } from '../controllers/Upload';
import { Income } from '../models/Income';
import fs from 'fs';
import pdfParse from 'pdf-parse';

jest.mock('../models/Income');
jest.mock('fs');
jest.mock('pdf-parse');

describe('Upload Controller', () => {
  it('uploadFile saves income and returns data', async () => {
    (fs.readFileSync as jest.Mock).mockReturnValue(Buffer.from('pdf'));
    (pdfParse as jest.Mock).mockResolvedValue({ text: 'סכום: 100\nלקוח: ישראל' });
    (Income as any).mockImplementation(() => ({
      save: jest.fn().mockResolvedValue({ amount: 100, client: 'ישראל' })
    }));

    const req = { file: { path: 'test.pdf' } } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;
    await uploadFile(req, res, jest.fn());
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.any(String),
        income: expect.objectContaining({ amount: 100, client: 'ישראל' })
      })
    );
  });

  it('uploadFile returns 400 if no file', async () => {
    const req = {} as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    await uploadFile(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
  });
});