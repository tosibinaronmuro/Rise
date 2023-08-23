import express from 'express';
import { uploadFile, downloadFile, deleteFile, deleteFolder,createFolder, getAllFiles } from '../controllers/googleCloud-user';

import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.route('/upload').post(upload.single('file'), uploadFile);
router.route('/create-folder').post(createFolder);
router.route('/upload/:folderName').post(upload.single('file'), uploadFile);  
router.route('/download/:fileName').get(downloadFile);
router.route('/download/:folderName/:fileName').get(downloadFile);
router.route('/delete/:fileName').delete(deleteFile);
router.route('/delete-folder/:folderName').delete(deleteFolder);
router.route('/get-all-files').get(getAllFiles);

export default router;