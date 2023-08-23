import express from 'express';
import { uploadFile, downloadFile } from '../controllers/googleCloud';

import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.route('/upload').post(upload.single('file'), uploadFile);
router.route('/upload/:folderName').post(upload.single('file'), uploadFile);  
router.route('/download/:fileName').get(downloadFile);
router.route('/download/:folderName/:fileName').get(downloadFile);

export default router;