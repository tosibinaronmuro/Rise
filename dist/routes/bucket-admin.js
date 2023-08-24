"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const googleCloudAdmin_1 = require("../controllers/googleCloudAdmin");
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
const router = express_1.default.Router();
router.route('/delete/:fileName').delete(googleCloudAdmin_1.deleteFile);
router.route('/delete-folder/:folderName').delete(googleCloudAdmin_1.deleteFolder);
router.route('/get-all-files').get(googleCloudAdmin_1.getAllFiles);
exports.default = router;
