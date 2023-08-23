"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFiles = exports.deleteFile = exports.deleteFolder = exports.createFolder = exports.downloadFile = exports.uploadFile = void 0;
const storage_1 = require("@google-cloud/storage");
const stream_1 = require("stream");
const path_1 = __importDefault(require("path"));
const gc = new storage_1.Storage({
    keyFilename: path_1.default.join(__dirname, `../../${process.env.GOOGLE_KEY_FILE_NAME}`),
    projectId: `${process.env.GOOGLE_PROJECT_ID}`,
});
const risecloudBucket = gc.bucket("risecloud");
const uploadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const fileBuffer = req.file.buffer;
        const destinationFileName = req.file.originalname;
        const folderName = req.body.folderName;
        let contentType;
        const extension = path_1.default.extname(destinationFileName).toLowerCase();
        if (extension === ".pdf") {
            contentType = "application/pdf";
        }
        else if (extension === ".png") {
            contentType = "image/png";
        }
        else if (extension === ".mp4") {
            contentType = "video/mp4";
        }
        else if (extension === ".mov") {
            contentType = "video/quicktime";
        }
        else {
            contentType = "application/octet-stream";
        }
        const fileOptions = {
            resumable: false,
            validation: "md5",
            metadata: {
                contentType,
            },
        };
        let file;
        if (folderName) {
            file = risecloudBucket.file(`${folderName}/${destinationFileName}`);
        }
        else {
            file = risecloudBucket.file(destinationFileName);
        }
        if (req.file.size > 200 * 1024 * 1024) {
            return res.status(400).json({ message: "File too large" });
        }
        const writableStream = file.createWriteStream(fileOptions);
        const readableStream = new stream_1.Readable();
        readableStream.push(fileBuffer);
        readableStream.push(null);
        readableStream.pipe(writableStream);
        writableStream.on("finish", () => {
            console.log(`File ${destinationFileName} uploaded to bucket`);
            return res.status(201).json({ message: "File uploaded successfully" });
        });
        writableStream.on("error", (error) => {
            console.error(error);
            return res
                .status(500)
                .json({ message: "An error occurred while uploading the file" });
        });
    }
    catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ message: "An error occurred while uploading the file" });
    }
});
exports.uploadFile = uploadFile;
const downloadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileName = req.params.fileName;
        const folderName = req.params.folderName;
        const filePath = folderName ? `${folderName}/${fileName}` : fileName;
        const file = risecloudBucket.file(filePath);
        const readableStream = file.createReadStream();
        const extension = path_1.default.extname(fileName);
        let contentType = "application/octet-stream";
        if (extension === ".pdf") {
            contentType = "application/pdf";
        }
        else if (extension === ".png") {
            contentType = "image/png";
        }
        else if (extension === ".mp4") {
            contentType = "video/mp4";
        }
        else if (extension === ".mov") {
            contentType = "video/quicktime";
        }
        else if (extension === ".avi") {
            contentType = "video/x-msvideo";
        }
        res.setHeader("Content-Type", contentType);
        res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
        readableStream.pipe(res);
    }
    catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ message: "An error occurred while downloading the file" });
    }
});
exports.downloadFile = downloadFile;
const createFolder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { folderName } = req.body;
        if (!folderName) {
            return res.status(400).json({ message: "Please provide a folder name" });
        }
        const folderExists = yield risecloudBucket.file(`${folderName}/`).exists();
        if (folderExists[0]) {
            return res.status(400).json({ message: "Folder already exists" });
        }
        const folderFile = risecloudBucket.file(`${folderName}/.keep`);
        yield folderFile.save("");
        return res.status(201).json({ message: "Folder created successfully" });
    }
    catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ message: "An error occurred while creating the folder" });
    }
});
exports.createFolder = createFolder;
const deleteFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileName = req.params.fileName;
        const file = risecloudBucket.file(fileName);
        // TODO: Implement authorization logic here to check if the user is allowed to delete the file
        file.delete();
        return res.status(200).json({ message: "File deleted successfully" });
    }
    catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ message: "An error occurred while deleting the file" });
    }
});
exports.deleteFile = deleteFile;
const deleteFolder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const folderName = req.params.folderName;
        // TODO: Implement authorization logic here to check if the user is allowed to delete the folder
        const [files] = yield risecloudBucket.getFiles({
            prefix: `${folderName}/`,
        });
        for (const file of files) {
            yield file.delete();
        }
        return res
            .status(200)
            .json({ message: "Folder and its contents deleted successfully" });
    }
    catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ message: "An error occurred while deleting the folder" });
    }
});
exports.deleteFolder = deleteFolder;
const getAllFiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [files] = yield risecloudBucket.getFiles();
        const fileNames = files.map((file) => file.name);
        return res.status(200).json({ files: fileNames });
    }
    catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ message: "An error occurred while fetching files" });
    }
});
exports.getAllFiles = getAllFiles;
