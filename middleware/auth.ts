import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken'; 
import { Unauthenticated } from '../errors';
import  {Payload, SecretKey } from 'types';


const secretKey: SecretKey = process.env.JWT_SECRET || "";

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
    req.user = payload;  
    next();
  } catch (error) {
    throw new Unauthenticated('Authentication invalid');
  }
};

export default authMiddleware;
