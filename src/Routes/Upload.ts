import express from 'express';
import { uploadFile } from '../controllers/Upload';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // תיקיית יעד לקבצים

router.post('/', upload.single('file'), (req, res, next) => {
	uploadFile(req, res, next).catch(next);
});

export default router;