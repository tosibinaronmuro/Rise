import express, { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequest, CustomError } from "../errors";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import pool from "../dbConfig";
import { SecretKey } from '../types';
const router = express.Router();


 

const secretKey: SecretKey = process.env.JWT_SECRET || ''; ;  

const register = async (req: Request, res: Response) => {
  try {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      throw new BadRequest("Please provide name, email, and password");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const emailExistsQuery = 'SELECT * FROM users WHERE email = $1';
      const emailExistsResult = await client.query(emailExistsQuery, [email]);

      if (emailExistsResult.rows.length > 0) {
        throw new BadRequest("Email already exists");
      }

      const insertUserQuery =
        'INSERT INTO users (fullname, email, password) VALUES ($1, $2, $3) RETURNING id';
      const insertUserResult = await client.query(insertUserQuery, [
        fullname,
        email,
        hashedPassword,
      ]);

      console.log('Registration successful');

      await client.query('COMMIT');

       
      const token = jwt.sign({ userId: insertUserResult.rows[0].id }, secretKey);

      res.status(201).json({ message: 'Registration successful', token });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;  
    } finally {
      client.release();
    }
  } catch (error:string[]| any) {
    console.error(error);
    res.status(error.status || 500).json({ message: error.message || 'An error occurred' });
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
      const userQuery = 'SELECT * FROM users WHERE email = $1';
      const userResult = await client.query(userQuery, [email]);

      if (userResult.rows.length === 0) {
        throw new BadRequest("User not found");
      }

      const user = userResult.rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        throw new BadRequest("Invalid password");
      }

      const token = jwt.sign({ userId: user.id }, secretKey);

      res.status(200).json({ message: 'Login successful', username: user.fullname, token });
    } catch (error) {
      throw error;  
    } finally {
      client.release();
    }
  } catch (error:string[] | any) {
    console.error(error);
    res.status(error.status || 500).json({ message: error.message || 'An error occurred' });
  }
};

 

const logout = (req: Request, res: Response) => {
  res.status(StatusCodes.OK).send("logout");
};

export { register, login, logout };
