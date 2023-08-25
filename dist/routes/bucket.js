"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const googleCloud_user_1 = require("../controllers/googleCloud-user");
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
const router = express_1.default.Router();
router.route('/upload').post(upload.single('file'), googleCloud_user_1.uploadFile);
router.route('/create-folder').post(googleCloud_user_1.createFolder);
router.route('/upload/:folderName').post(upload.single('file'), googleCloud_user_1.uploadFile);
router.route('/download/:fileName').get(googleCloud_user_1.downloadFile);
router.route('/get-all-files').get(googleCloud_user_1.getAllFiles);
router.route('/download/:folderName/:fileName').get(googleCloud_user_1.downloadFile);
router.route('/delete/:fileName').delete(googleCloud_user_1.deleteFile);
exports.default = router;
