import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import pdfParse from 'pdf-parse';
import path from 'path';
import { Income } from '../models/Income';
import { Client } from '../models/Client';

export const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // קריאת הקובץ מהשרת
    const filePath = path.resolve(req.file.path);
    const dataBuffer = fs.readFileSync(filePath);

    // קריאת הטקסט מה-PDF
    const pdfData = await pdfParse(dataBuffer);

    // פיצול הטקסט לשורות
    const lines = pdfData.text.split('\n').map(line => line.trim()).filter(line => line.length > 0);


    // חילוץ שם לקוח וסכום מהטקסט
    let amount = 0;
    let clientName = '';
    lines.forEach(line => {
      if (line.startsWith('סכום:')) {
        amount = parseFloat(line.replace('סכום:', '').trim());
      }
      if (line.startsWith('לקוח:')) {
        clientName = line.replace('לקוח:', '').trim();
      }
    });

    // חיפוש לקוח במסד לפי שם
    const clientDoc = await Client.findOne({ name: clientName });
    if (!clientDoc) {
      return res.status(400).json({ error: 'Client not found in database' });
    }

    // הכנסת נתונים למסד הנתונים (הכנסה)
    const income = new Income({
      amount,
      client: clientDoc._id,
      date: new Date(),
      vat: req.body.vat,
      paymentMethod: req.body.paymentMethod,
      receiptNumber: req.body.receiptNumber
    });
    await income.save();

    // דוגמה: חיפוש שורות עם "סה\"כ"
    const totals = lines.filter(line => line.includes('סה"כ'));

    res.json({
      message: 'הקובץ נקלט והנתונים נשמרו',
      totals,
      allText: pdfData.text,
      income
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};