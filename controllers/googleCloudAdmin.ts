import { Request, Response } from "express";
import express from "express";
import { Storage } from "@google-cloud/storage";
import { Readable } from "stream";
import path from "path";
import { Payload } from "types";

const gc = new Storage({
  keyFilename: path.join(
    __dirname,
    `../../${process.env.GOOGLE_KEY_FILE_NAME}`
  ),
  projectId: `${process.env.GOOGLE_PROJECT_ID}`,
});

const risecloudBucket = gc.bucket("risecloud");

const deleteFile = async (req: Request, res: Response) => {
    try {
      const fileName = req.params.fileName;
  
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
  
  const deleteFolder = async (req: Request, res: Response) => {
    try {
      const folderName = req.params.folderName;  
      const [files] = await risecloudBucket.getFiles({
        prefix: `${folderName}/`,
      });
  
      for (const file of files) {
        await file.delete();
      }
  
      return res
        .status(200)
        .json({ message: "Folder and its contents deleted successfully" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "An error occurred while deleting the folder" });
    }
  };
  
   
  
  const getAllFiles = async (req: Request, res: Response) => {
    try {
      const [files] = await risecloudBucket.getFiles();
  
      const fileDetails = files.map((file) => {
        const fileName = file.name;
        const encodedFileName = encodeURIComponent(fileName);
        const createdBy = file.metadata.createdBy as Payload | undefined;
        console.log(
          "createdBy:",
          createdBy,
          "metadata: ",
          file.metadata,
          " file: ",
          file
        );
  
        return {
          fileName,
          encodedFileName,
          uploaderFullName: createdBy ? createdBy.fullName : "Unknown",
          uploaderUserId: createdBy ? createdBy.userId : "Unknown",
        };
      });
  
      return res.status(200).json({ files: fileDetails });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "An error occurred while fetching files" });
    }
  };

export {
 deleteFile,deleteFolder,getAllFiles,
  
};
