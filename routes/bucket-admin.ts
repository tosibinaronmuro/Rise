import express from 'express';
import { deleteFile  ,deleteFolder,getAllFiles,invalidatePublicKey } from '../controllers/googleCloudAdmin';

import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.route('/delete/:fileName').delete(deleteFile);
router.route('/delete-folder/:folderName').delete(deleteFolder);
router.route('/get-all-files').get(getAllFiles);
router.route('/terminate-session/:userId').put(invalidatePublicKey);


export default router;