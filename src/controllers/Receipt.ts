import { Request, Response, NextFunction } from 'express';
import PDFDocument from 'pdfkit';
import { Receipt } from '../models/Receipt'; // ודא שיש לך מודל כזה

// CRUD Operations
export const getAllReceipts = async (req: Request, res: Response): Promise<void> => {
  try {
    const receipts = await Receipt.find();
    res.json(receipts);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getReceiptById = async (req: Request, res: Response): Promise<void> => {
  try {
    const receipt = await Receipt.findById(req.params.id);
    if (!receipt) {
      res.status(404).json({ error: 'Receipt not found' });
      return;
    }
    res.json(receipt);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createReceipt = async (req: Request, res: Response): Promise<void> => {
  try {
    const receipt = new Receipt(req.body);
    await receipt.save();
    res.status(201).json(receipt);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updateReceipt = async (req: Request, res: Response): Promise<void> => {
  try {
    const receipt = await Receipt.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!receipt) {
      res.status(404).json({ error: 'Receipt not found' });
      return;
    }
    res.json(receipt);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteReceipt = async (req: Request, res: Response): Promise<void> => {
  try {
    const receipt = await Receipt.findByIdAndDelete(req.params.id);
    if (!receipt) {
      res.status(404).json({ error: 'Receipt not found' });
      return;
    }
    res.json({ message: 'Receipt deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const downloadReceiptPdf = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const receipt = await Receipt.findById(req.params.id);
    if (!receipt) return res.status(404).json({ error: 'Receipt not found' });

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=receipt_${receipt._id}.pdf`);
    doc.pipe(res);

    doc.fontSize(20).text('קבלה', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`מספר קבלה: ${receipt._id}`);
    doc.text(`תאריך: ${receipt.date}`);
    doc.text(`סכום: ${receipt.amount}`);
    doc.text(`לקוח: ${receipt.clientName}`);
    // הוסף עוד שדות לפי הצורך

    doc.end();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};