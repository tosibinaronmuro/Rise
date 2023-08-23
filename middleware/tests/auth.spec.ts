import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Unauthenticated } from '../../errors/index';
import authMiddleware from '../auth';  
import { Payload, SecretKey } from '../../types';  

const secretKey: SecretKey = process.env.JWT_SECRET || "";

jest.mock('jsonwebtoken');

describe('authMiddleware', () => {
  let mockReq: Request;
  let mockRes: Response;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {} as Request;
    mockRes = {} as Response;
    mockNext = jest.fn();
  });

  it('should throw Unauthenticated error if no authorization header', () => {
    mockReq.headers = {};
    expect(() => authMiddleware(mockReq, mockRes, mockNext)).toThrow(Unauthenticated);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should throw Unauthenticated error if authorization header does not start with Bearer', () => {
    mockReq.headers = { authorization: 'InvalidHeader' };
    expect(() => authMiddleware(mockReq, mockRes, mockNext)).toThrow(Unauthenticated);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should throw Unauthenticated error if token is missing', () => {
    mockReq.headers = { authorization: 'Bearer' };
    expect(() => authMiddleware(mockReq, mockRes, mockNext)).toThrow(Unauthenticated);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should call next if token is valid', () => {
    const mockPayload: Payload = { userId: '123', name: 'John' };
    const mockToken = 'validToken';

    mockReq.headers = { authorization: `Bearer ${mockToken}` };
    jwt.verify = jest.fn().mockReturnValue(mockPayload);

    authMiddleware(mockReq, mockRes, mockNext);

    expect(jwt.verify).toHaveBeenCalledWith(mockToken, secretKey);
    expect(mockReq.user).toEqual(mockPayload);
    expect(mockNext).toHaveBeenCalled();
  });

  it('should throw Unauthenticated error if jwt.verify throws an error', () => {
    mockReq.headers = { authorization: 'Bearer invalidToken' };
    jwt.verify = jest.fn().mockImplementation(() => {
      throw new Error('Invalid token');
    });

    expect(() => authMiddleware(mockReq, mockRes, mockNext)).toThrow(Unauthenticated);
    expect(mockNext).not.toHaveBeenCalled();
  });
});
