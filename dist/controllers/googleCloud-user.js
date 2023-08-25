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
exports.deleteFile = exports.getAllFiles = exports.createFolder = exports.downloadFile = exports.uploadFile = void 0;
const storage_1 = require("@google-cloud/storage");
const stream_1 = require("stream");
const path_1 = __importDefault(require("path"));
const dbConfig_1 = __importDefault(require("../dbConfig"));
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
        const extension = path_1.default.extname(destinationFileName).toLowerCase();
        if (req.file.size > 200 * 1024 * 1024) {
            return res.status(400).json({ message: "File too large" });
        }
        const createdBy = req.user;
        const contentType = (() => {
            if (extension === ".pdf")
                return "application/pdf";
            if (extension === ".png")
                return "image/png";
            if (extension === ".mp4")
                return "video/mp4";
            if (extension === ".mov")
                return "video/quicktime";
            return "application/octet-stream";
        })();
        const folderPath = folderName ? `${folderName}/` : "";
        const fileKey = `${folderPath}${destinationFileName}`;
        const fileOptions = {
            resumable: false,
            validation: "md5",
            metadata: {
                contentType,
                createdBy: {
                    id: createdBy.userId,
                    fullName: createdBy.name,
                    email: createdBy.email,
                },
                createdAt: new Date(),
                flag: false,
            },
        };
        const writableStream = risecloudBucket
            .file(fileKey)
            .createWriteStream(fileOptions);
        writableStream.on("finish", () => __awaiter(void 0, void 0, void 0, function* () {
            console.log(`File ${destinationFileName} uploaded to bucket`);
            const insertQuery = `
      INSERT INTO uploads (userId, fullname, email, filename, filelink)
      VALUES ($1, $2, $3, $4, $5)
    `;
            yield dbConfig_1.default.query(insertQuery, [
                createdBy.userId,
                createdBy.name,
                createdBy.email,
                fileKey,
                `https://storage.googleapis.com/risecloud/${fileKey}`,
            ]);
            console.log(`File ${destinationFileName} uploaded to bucket and database`);
            return res.status(201).json({ message: "File uploaded successfully" });
        }));
        writableStream.on("error", (error) => {
            console.error(error);
            return res
                .status(500)
                .json({ message: "An error occurred while uploading the file" });
        });
        // Pipe the file buffer into the writable stream
        const readableStream = new stream_1.Readable();
        readableStream.push(fileBuffer);
        readableStream.push(null);
        readableStream.pipe(writableStream);
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
        console.log("file: ", file);
        const extension = path_1.default.extname(fileName);
        // Content type mapping
        const contentTypeMap = {
            ".pdf": "application/pdf",
            ".png": "image/png",
            ".mp4": "video/mp4",
            ".mov": "video/quicktime",
            ".avi": "video/x-msvideo",
        };
        const contentType = contentTypeMap[extension] || "application/octet-stream";
        res.setHeader("Content-Type", contentType);
        res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
        const readableStream = file.createReadStream();
        const pipePromise = new Promise((resolve, reject) => {
            readableStream.on("end", resolve);
            readableStream.on("error", reject);
        });
        yield new Promise((resolve, reject) => {
            readableStream
                .pipe(res)
                .on("finish", resolve)
                .on("error", reject);
        });
        yield pipePromise;
    }
    catch (error) {
        console.error("Error:", error);
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
const getAllFiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const createdBy = req.user;
        const query = `
      SELECT filename, fullname, userid, filelink
      FROM uploads
      WHERE userid = $1
    `;
        const result = yield dbConfig_1.default.query(query, [createdBy.userId]);
        const files = result.rows.map((row) => {
            const fileName = row.filename;
            const encodedFileName = encodeURIComponent(fileName);
            const uploaderFullName = row.fullname;
            const uploaderUserId = row.userid;
            const filelink = row.filelink;
            return {
                fileName,
                encodedFileName,
                uploaderFullName,
                uploaderUserId,
                filelink,
            };
        });
        return res.status(200).json({ files });
    }
    catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ message: "An error occurred while fetching files" });
    }
});
exports.getAllFiles = getAllFiles;
const deleteFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileName = req.params.fileName;
        const createdBy = req.user;
        const query = `
      DELETE FROM uploads
      WHERE userid = $1 AND filename = $2
    `;
        const result = yield dbConfig_1.default.query(query, [createdBy.userId, fileName]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "File not found" });
        }
        const file = risecloudBucket.file(fileName);
        yield file.delete();
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
