import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import pdfParse from 'pdf-parse';
import path from 'path';
import { Income } from '../models/Income'; // ודא שמודל זה קיים

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

    // דוגמה: חילוץ סכום ולקוח מהטקסט
    let amount = 0;
    let client = '';
    lines.forEach(line => {
      if (line.startsWith('סכום:')) {
        amount = parseFloat(line.replace('סכום:', '').trim());
      }
      if (line.startsWith('לקוח:')) {
        client = line.replace('לקוח:', '').trim();
      }
    });

    // הכנסת נתונים למסד הנתונים (הכנסה)
const income = new Income({
  amount,
  client,
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