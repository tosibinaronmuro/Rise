import { Request, Response } from "express";
import express from "express";
import { Storage } from "@google-cloud/storage";
import { Readable } from "stream";
import path from "path";

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

    let contentType;

    const extension = path.extname(destinationFileName).toLowerCase();

    if (extension === ".pdf") {
      contentType = "application/pdf";
    } else if (extension === ".png") {
      contentType = "image/png";
    } else if (extension === ".mp4") {
      contentType = "video/mp4";
    } else if (extension === ".mov") {
      contentType = "video/quicktime";
    } else {
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
    } else {
      file = risecloudBucket.file(destinationFileName);
    }

    if (req.file.size > 200 * 1024 * 1024) {
      return res.status(400).json({ message: "File too large" });
    }

    const writableStream = file.createWriteStream(fileOptions);
    const readableStream = new Readable();
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
    const file = risecloudBucket.file(filePath);
    const readableStream = file.createReadStream();

    const extension = path.extname(fileName);

    let contentType = "application/octet-stream";

    if (extension === ".pdf") {
      contentType = "application/pdf";
    } else if (extension === ".png") {
      contentType = "image/png";
    } else if (extension === ".mp4") {
      contentType = "video/mp4";
    } else if (extension === ".mov") {
      contentType = "video/quicktime";
    } else if (extension === ".avi") {
      contentType = "video/x-msvideo";
    }

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    readableStream.pipe(res);
  } catch (error) {
    console.error(error);
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
const deleteFile = async (req: Request, res: Response) => {
    try {
      const fileName = req.params.fileName;
  
      const file = risecloudBucket.file(fileName);
  
      // TODO: Implement authorization logic here to check if the user is allowed to delete the file
  
      file.delete();
  
      return res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'An error occurred while deleting the file' });
    }
  };
  
  const deleteFolder = async (req: Request, res: Response) => {
    try {
      const folderName = req.params.folderName;
  
      // TODO: Implement authorization logic here to check if the user is allowed to delete the folder
  
      const [files] = await risecloudBucket.getFiles({ prefix: `${folderName}/` });
  
      for (const file of files) {
        await file.delete();
      }
  
      return res.status(200).json({ message: 'Folder and its contents deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'An error occurred while deleting the folder' });
    }
  };

export { uploadFile, downloadFile, createFolder, deleteFolder,deleteFile };
