import express, { Request, Response, NextFunction } from 'express';
import { downloadReceiptPdf } from '../controllers/Receipt';

const router = express.Router();

router.get('/:id/pdf', downloadReceiptPdf as (req: Request, res: Response, next: NextFunction) => any);

export default router;