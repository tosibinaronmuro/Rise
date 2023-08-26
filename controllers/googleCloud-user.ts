import { Request, Response } from "express";
import express from "express";
import { Storage } from "@google-cloud/storage";
import { Readable } from "stream";
import path from "path";
import { Payload } from "types";
import StorageError from "../errors/storageError";
import pool from "../dbConfig";

const gc = new Storage({
  keyFilename: path.join(
    __dirname,
    `../../${process.env.GOOGLE_KEY_FILE_NAME}`
  ),
  projectId: `${process.env.GOOGLE_PROJECT_ID}`,
});

const risecloudBucket = gc.bucket("risecloud");

const uploadFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileBuffer = req.file.buffer;
    const destinationFileName = req.file.originalname;
    const folderName = req.body.folderName;

    const extension = path.extname(destinationFileName).toLowerCase();

    if (req.file.size > 200 * 1024 * 1024) {
      return res.status(400).json({ message: "File too large" });
    }

    const createdBy: Payload = req.user as Payload;
    
    const contentType = (() => {
      if (extension === ".pdf") return "application/pdf";
      if (extension === ".png") return "image/png";
      if (extension === ".mp4") return "video/mp4";
      if (extension === ".mov") return "video/quicktime";
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

    writableStream.on("finish", async () => {
      console.log(`File ${destinationFileName} uploaded to bucket`);

      const insertQuery = `
      INSERT INTO uploads (userId, fullname, email, filename, filelink)
      VALUES ($1, $2, $3, $4, $5)
    `;
    
    await pool.query(insertQuery, [
      createdBy.userId,
      createdBy.name,
      createdBy.email,
      fileKey,
      `${process.env.CONTENT_BASE_URL}/${fileKey}`, 
    
    ]);
    

      console.log(`File ${destinationFileName} uploaded to bucket and database`);

      return res.status(201).json({ message: "File uploaded successfully" });
    });

    writableStream.on("error", (error) => {
      console.error(error);
      return res
        .status(500)
        .json({ message: "An error occurred while uploading the file" });
    });

    // Pipe the file buffer into the writable stream
    const readableStream = new Readable();
    readableStream.push(fileBuffer);
    readableStream.push(null);
    readableStream.pipe(writableStream);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while uploading the file" });
  }
};


const downloadFile = async (req: Request, res: Response) => {
  try {
    const fileName = req.params.fileName;
    const folderName = req.params.folderName;
    const filePath = folderName ? `${folderName}/${fileName}` : fileName;
const encodedFilePath=decodeURIComponent(filePath);
    const file = risecloudBucket.file(encodedFilePath);
    console.log("file: ", file);
    const extension = path.extname(fileName);

    // Content type mapping
    const contentTypeMap: Record<string, string> = {
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

   
    const pipePromise = new Promise<void>((resolve, reject) => {
      readableStream.on("end", resolve);
      readableStream.on("error", reject);
    });

    await new Promise<void>((resolve, reject) => {
      readableStream
        .pipe(res)
        .on("finish", resolve)
        .on("error", reject);
    });

    await pipePromise;  
  } catch (error: any) {
    console.error("Error:", error);

    return res
      .status(500)
      .json({ message: "An error occurred while downloading the file" });
  }
};


const createFolder = async (req: Request, res: Response) => {
  try {
    const { folderName } = req.body;

    if (!folderName) {
      return res.status(400).json({ message: "Please provide a folder name" });
    }

    const folderExists = await risecloudBucket.file(`${folderName}/`).exists();
    if (folderExists[0]) {
      return res.status(400).json({ message: "Folder already exists" });
    }

    const folderFile = risecloudBucket.file(`${folderName}/.keep`);
    await folderFile.save("");

    return res.status(201).json({ message: "Folder created successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while creating the folder" });
  }
};
const getAllFiles = async (req: Request, res: Response) => {
  try {
    const createdBy: Payload = req.user as Payload;

    const query = `
      SELECT filename, fullname, userid, filelink
      FROM uploads
      WHERE userid = $1
    `;

    const result = await pool.query(query, [createdBy.userId]);

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
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching files" });
  }
};
const deleteFile = async (req: Request, res: Response) => {
  try {
    const fileName = req.params.fileName;
    const createdBy: Payload = req.user as Payload;

    const query = `
      DELETE FROM uploads
      WHERE userid = $1 AND filename = $2
    `;

    const result = await pool.query(query, [createdBy.userId, fileName]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    const file = risecloudBucket.file(fileName);
    await file.delete();

    return res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while deleting the file" });
  }
};


export { uploadFile, downloadFile, createFolder,getAllFiles ,deleteFile};
