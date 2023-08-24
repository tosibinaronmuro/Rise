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
exports.getAllFiles = exports.deleteFolder = exports.deleteFile = void 0;
const storage_1 = require("@google-cloud/storage");
const path_1 = __importDefault(require("path"));
const gc = new storage_1.Storage({
    keyFilename: path_1.default.join(__dirname, `../../${process.env.GOOGLE_KEY_FILE_NAME}`),
    projectId: `${process.env.GOOGLE_PROJECT_ID}`,
});
const risecloudBucket = gc.bucket("risecloud");
const deleteFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileName = req.params.fileName;
        const file = risecloudBucket.file(fileName);
        const createdBy = file.metadata.createdBy;
        console.log("createdBy " + file.metadata.createdBy, "req.user " + req.user);
        if (!req.user || !createdBy || req.user.userId !== createdBy.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }
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
const deleteFolder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const folderName = req.params.folderName;
        // Check if the user is authorized to delete the folder and its contents
        const createdBy = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!createdBy) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const [files] = yield risecloudBucket.getFiles({
            prefix: `${folderName}/`,
        });
        for (const file of files) {
            const fileCreatedBy = (_b = file.metadata.createdBy) === null || _b === void 0 ? void 0 : _b.id;
            console.log("fileCreatedby " + fileCreatedBy, "createdby" + createdBy);
            if (fileCreatedBy !== createdBy) {
                return res.status(403).json({ message: "Unauthorized" });
            }
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
        const fileDetails = files.map((file) => {
            const fileName = file.name;
            const encodedFileName = encodeURIComponent(fileName);
            const createdBy = file.metadata.createdBy;
            console.log("createdBy:", createdBy, "metadata: ", file.metadata, " file: ", file);
            return {
                fileName,
                encodedFileName,
                uploaderFullName: createdBy ? createdBy.fullName : "Unknown",
                uploaderUserId: createdBy ? createdBy.userId : "Unknown",
            };
        });
        return res.status(200).json({ files: fileDetails });
    }
    catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ message: "An error occurred while fetching files" });
    }
});
exports.getAllFiles = getAllFiles;
