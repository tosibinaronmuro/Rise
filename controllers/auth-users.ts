import bcrypt from "bcryptjs";
import express, { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import pool from "../dbConfig";
import { BadRequest, Unauthenticated } from "../errors";
import { SecretKey } from "../types";
import { generatePublicKey } from "../utils/encryption";
import {
  forgotPasswordEmailTemplate,
  mailTransport,
  resetPasswordEmailTemplate,
} from "../utils/helper";
const router = express.Router();

const secretKey: SecretKey = process.env.JWT_SECRET || "";

const register = async (req: Request, res: Response) => {
  try {
    const { fullname, email, password } = req.body;
    const role = "user";
    if (!fullname || !email || !password) {
      throw new BadRequest("Please provide name, email, and password");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const emailExistsQuery = "SELECT * FROM users WHERE email = $1";
      const emailExistsResult = await client.query(emailExistsQuery, [email]);

      if (emailExistsResult.rows.length > 0) {
        throw new BadRequest("Email already exists");
      }

      const insertUserQuery =
        "INSERT INTO users (fullname, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id";
      const insertUserResult = await client.query(insertUserQuery, [
        fullname,
        email,
        hashedPassword,
        role,
      ]);

      await client.query("COMMIT");

      const payload = {
        userId: insertUserResult.rows[0].id,
        name: fullname,
        email: email,
        role: role,
      };
      const token = jwt.sign(payload, secretKey);

      res
        .status(201)
        .json({ message: "Registration successful", user: payload });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error: string[] | any) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ message: error.message || "An error occurred" });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequest("Please provide email and password");
    }

    const client = await pool.connect();
    try {
      const userQuery = "SELECT * FROM users WHERE email = $1";
      const userResult = await client.query(userQuery, [email]);

      if (userResult.rows.length === 0) {
        throw new BadRequest("User not found");
      }

      const user = userResult.rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        throw new BadRequest("Invalid password");
      }

      const publicKey = generatePublicKey();

      const payload = {
        userId: user.id,
        name: user.fullname,
        email: user.email,
        role: user.role,
        publicKey,
      };

      const updatePublicKeyQuery =
        'UPDATE users SET "publicKey" = $1 WHERE id = $2';
      await client.query(updatePublicKeyQuery, [publicKey, user.id]);

      const token = jwt.sign(payload, secretKey);

      res
        .status(200)
        .json({ message: "Login successful", user: payload, token });
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ message: error.message || "An error occurred" });
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    console.log(req.user, "hello");
    if (!userId) {
      throw new Unauthenticated("User not authenticated");
    }

    const client = await pool.connect();
    try {
      const updatePublicKeyQuery =
        'UPDATE users SET "publicKey" = NULL WHERE id = $1';
      await client.query(updatePublicKeyQuery, [userId]);

      res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ message: error.message || "An error occurred" });
  }
};

const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new BadRequest("Please provide an email address");
    }

    const client = await pool.connect();
    try {
      const userQuery = "SELECT * FROM users WHERE email = $1";
      const userResult = await client.query(userQuery, [email]);

      if (userResult.rows.length === 0) {
        throw new BadRequest("User not found");
      }

      const user = userResult.rows[0];
      const resetToken = jwt.sign({ userId: user.id }, secretKey, {
        expiresIn: "5m",
      });

      const resetLink = `http://localhost:3000/reset-password/?token=${resetToken}`;

      const mailConfigs = {
        from: process.env.MY_EMAIL,
        to: user.email,
        subject: "Reset Password for Your App",
        html: forgotPasswordEmailTemplate(resetLink, user.fullname),
      };

      await mailTransport.sendMail(mailConfigs);

      res
        .status(200)
        .json({ message: "Password reset link sent to your email" });
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  } catch (error: string[] | any) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ message: error.message || "An error occurred" });
  }
};

// this controller uses a one time token
// const forgotPassword = async (req: Request, res: Response) => {
//     try {
//       const { email } = req.body;

//       if (!email) {
//         throw new BadRequest("Please provide an email address");
//       }

//       const client = await pool.connect();
//       try {
//         const userQuery = "SELECT * FROM users WHERE email = $1";
//         const userResult = await client.query(userQuery, [email]);

//         if (userResult.rows.length === 0) {
//           throw new BadRequest("User not found");
//         }

//         const user = userResult.rows[0];

//
//         const resetToken = crypto.randomBytes(32).toString('hex');

//
//         const updateTokenQuery = "UPDATE users SET reset_token = $1 WHERE id = $2";
//         await client.query(updateTokenQuery, [resetToken, user.id]);

//         const resetLink = `http://localhost:3000/reset-password/?token=${resetToken}`;

//         const mailConfigs = {
//           from: process.env.MY_EMAIL,
//           to: user.email,
//           subject: "Reset Password for Your App",
//           html: forgotPasswordEmailTemplate(resetLink, user.fullname),
//         };

//         await mailTransport.sendMail(mailConfigs);

//         res
//           .status(200)
//           .json({ message: "Password reset link sent to your email" });
//       } catch (error) {
//         throw error;
//       } finally {
//         client.release();
//       }
//     } catch (error: string[] | any) {
//       console.error(error);
//       res
//         .status(error.status || 500)
//         .json({ message: error.message || "An error occurred" });
//     }
//   };

const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      throw new BadRequest("Please provide token and new password");
    }

    const decodedToken = jwt.verify(token, secretKey) as JwtPayload & {
      userId: number;
    };
    const userId = decodedToken.userId;
    const loginLink = `http://localhost:3000/`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const client = await pool.connect();
    try {
      const updateQuery = "UPDATE users SET password = $1 WHERE id = $2";
      await client.query(updateQuery, [hashedPassword, userId]);

      // Send confirmation email
      const userQuery = "SELECT * FROM users WHERE id = $1";
      const userResult = await client.query(userQuery, [userId]);
      const user = userResult.rows[0];

      const mailConfigs = {
        from: process.env.MY_EMAIL,
        to: user.email,
        subject: "Password Change Confirmation",
        html: resetPasswordEmailTemplate(loginLink, user.fullname),
      };

      await mailTransport.sendMail(mailConfigs);

      res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  } catch (error: string[] | any) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ message: error.message || "An error occurred" });
  }
};

export { forgotPassword, login, logout, register, resetPassword };

