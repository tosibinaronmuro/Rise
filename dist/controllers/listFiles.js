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
const storage_1 = require("@google-cloud/storage");
const path_1 = __importDefault(require("path"));
const gc = new storage_1.Storage({
    keyFilename: path_1.default.join(__dirname, "../../scenic-precinct-396813-96efa28fc0a6.json"),
    projectId: "scenic-precinct-396813",
});
const risecloudBucket = gc.bucket("risecloud");
const listFilesInBucket = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [files] = yield risecloudBucket.getFiles();
        console.log("Files in the bucket:");
        files.forEach((file) => {
            console.log(file.name);
        });
    }
    catch (error) {
        console.error("Error listing files:", error);
    }
});
listFilesInBucket();
