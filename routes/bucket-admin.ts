import express from 'express';
import { deleteFile  ,deleteFolder,getAllFiles,invalidatePublicKey,getAdminFileHistory,getAdminUserFileHistory ,getAllUsers} from '../controllers/googleCloudAdmin';

import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.route('/delete/:fileName').delete(deleteFile);
router.route('/delete-folder/:folderName').delete(deleteFolder);
router.route('/get-all-files').get(getAllFiles);
router.route('/get-all-users').get(getAllUsers);
router.route('/history').get(getAdminFileHistory);
router.route('/history/:userId').get(getAdminUserFileHistory);
router.route('/terminate-session/:userId').put(invalidatePublicKey);


export default router;