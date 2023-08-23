 
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface Payload extends JwtPayload {  
    userId: string;
    name: string;
  }
declare global {
  namespace Express {
    interface Request {
      user?: Payload;  
    }
  }
}

export type SecretKey = string;