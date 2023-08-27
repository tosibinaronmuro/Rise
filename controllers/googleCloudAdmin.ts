import { Storage } from "@google-cloud/storage";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import path from "path";
import { Payload, SecretKey } from "types";
import pool from "../dbConfig";
import { NotFound, Unauthenticated } from "../errors";

const gc = new Storage({
  keyFilename: path.join(
    __dirname,
    `../../${process.env.GOOGLE_KEY_FILE_NAME}`
  ),
  projectId: `${process.env.GOOGLE_PROJECT_ID}`,
});
const secretKey: SecretKey = process.env.JWT_SECRET || "";
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

// const getAllFiles = async (req: Request, res: Response) => {
//   try {
//     const [files] = await risecloudBucket.getFiles();

//     const fileDetails = files.map((file) => {
//       const fileName = file.name;
//       const encodedFileName = encodeURIComponent(fileName);
//       const createdBy = file.metadata.createdBy as Payload | undefined;

//       return {
//         fileName,
//         encodedFileName,
//         uploaderFullName: createdBy ? createdBy.fullName : "Unknown",
//         uploaderUserId: createdBy ? createdBy.userId : "Unknown",
//       };
//     });

//     return res.status(200).json({ files: fileDetails });
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json({ message: "An error occurred while fetching files" });
//   }
// };
const getAllFiles = async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT filename, fullname  , userid  ,filelink
      FROM uploads
    `;

    const result = await pool.query(query);

    const files = result.rows.map((row) => {
      const fileName = row.filename;
      const encodedFileName = encodeURIComponent(fileName);
      const uploaderFullName = row.fullname ;
      const uploaderUserId = row.userid;
      const filelink=row.filelink

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


const invalidatePublicKey = async (req: Request, res: Response) => {
  const adminToken = req.headers.authorization?.split(" ")[1];

  if (!adminToken) {
    throw new Unauthenticated("Admin authentication required");
  }

  try {
    const adminPayload = jwt.verify(adminToken, secretKey) as Payload;

    if (adminPayload.role !== "admin") {
      throw new Unauthenticated("Admin authentication required");
    }

    const userId = req.params.userId;

    const client = await pool.connect();
    try {
      const userQuery = "SELECT * FROM users WHERE id = $1";
      const userResult = await client.query(userQuery, [userId]);
      const user = userResult.rows[0];

      if (userResult.rows.length === 0) {
        throw new NotFound("User not found");
      }

      
      const updateQuery = 'UPDATE users SET "publicKey" = NULL WHERE id = $1';
      await client.query(updateQuery, [userId]);

      res
        .status(200)
        .json({ message: `PublicKey invalidated for  ${user.fullname} ` });
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    throw error;
  }
};


const getAdminFileHistory = async (req: Request, res: Response) => {
  try {
    
    const query = `
      SELECT * FROM history
      ORDER BY date DESC;
    `;

    const result = await pool.query(query);
    const fileHistory = result.rows;

    return res.status(200).json(fileHistory);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: 'An error occurred while fetching file history' });
  }
};

const getAdminUserFileHistory = async (req: Request, res: Response) => {
  try {
    
    const userId = req.params.userId;

    const query = `
      SELECT * FROM history
      WHERE userid = $1
      ORDER BY date DESC;
    `;

    const result = await pool.query(query, [userId]);
    const userFileHistory = result.rows;

    return res.status(200).json(userFileHistory);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: 'An error occurred while fetching user file history' });
  }
};
 
const getAllUsers = async (req: Request, res: Response) => {
  try {
    

    const query = 'SELECT id, fullname, email FROM users';
    const result = await pool.query(query);

    const users = result.rows;

    res.status(200).json(users);
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ message: error.message || 'An error occurred' });
  }
};

export { deleteFile, deleteFolder, getAdminFileHistory, getAdminUserFileHistory, getAllFiles, getAllUsers, invalidatePublicKey };
