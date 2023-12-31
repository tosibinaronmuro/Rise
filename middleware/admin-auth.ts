import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Payload, SecretKey } from 'types';
import pool from '../dbConfig';
import { Unauthenticated } from '../errors';

const secretKey: SecretKey = process.env.JWT_SECRET || "";

const adminAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new Unauthenticated('Authentication invalid');
  }
 
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    throw new Unauthenticated('Authentication invalid');
  }

  try {
    const payload = jwt.verify(token, secretKey) as Payload;
    
    
    if (payload.role !== 'admin') {
      throw new Unauthenticated('Only admins are allowed');
    }
    const client = await pool.connect();
    try {
      const userQuery = 'SELECT "publicKey" FROM admin WHERE id = $1';
      const userResult = await client.query(userQuery, [payload.userId]);

      if (userResult.rows.length === 0) {
        throw new Unauthenticated('User not found');
      }
 
      const userPublicKey = userResult.rows[0].publicKey;
      // console.log(userPublicKey)
      if (userPublicKey !== payload.publicKey) {
        throw new Unauthenticated('Public key mismatch, retry login');
      } else {
        req.user = payload;
        next();
      }
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
    
  } catch (error) {
    next(error)
  }
};

export default adminAuthMiddleware;
