"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const googleCloud_1 = require("../controllers/googleCloud");
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
const router = express_1.default.Router();
router.route('/upload').post(upload.single('file'), googleCloud_1.uploadFile);
router.route('/create-folder').post(googleCloud_1.createFolder);
router.route('/upload/:folderName').post(upload.single('file'), googleCloud_1.uploadFile);
router.route('/download/:fileName').get(googleCloud_1.downloadFile);
router.route('/download/:folderName/:fileName').get(googleCloud_1.downloadFile);
router.route('/delete/:fileName').delete(googleCloud_1.deleteFile);
router.route('/delete-folder/:folderName').delete(googleCloud_1.deleteFolder);
exports.default = router;
