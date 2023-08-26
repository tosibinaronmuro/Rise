import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Unauthenticated } from '../errors';
import { Payload, SecretKey } from 'types';
import pool from "../dbConfig";

const secretKey: SecretKey = process.env.JWT_SECRET || '';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
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
    
    if (payload.role !== 'user') {
      throw new Unauthenticated('Only Users are allowed, create a user account and login');
    }
    const client = await pool.connect();
    try {
      const userQuery = 'SELECT "publicKey" FROM users WHERE id = $1';
      const userResult = await client.query(userQuery, [payload.userId]);

      if (userResult.rows.length === 0) {
        throw new Unauthenticated('User not found');
      }
 
      const userPublicKey = userResult.rows[0].publicKey;
 
      if (userPublicKey !== payload.publicKey) {
        throw new Unauthenticated('Public key mismatch, retry login');
      }

      req.user = payload;
      next();
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;
