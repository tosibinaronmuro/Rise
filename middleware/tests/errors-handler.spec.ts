import { StatusCodes } from 'http-status-codes';
import express from 'express';
import request from 'supertest';
import errorHandler from '../errors-handler';
import CustomError from '../../errors/custom-error';
   

describe('Error Handler Middleware', () => {
  const app = express();

  app.get('/', (req, res, next) => {
    next(new Error('Test Error'));
  });

  app.use(errorHandler);

  it('should handle CustomError instances', async () => {
    const error = new CustomError('Test Error', 400);
    const response = await request(app).get('/').send(error);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('msg', 'Test Error');
  });

  it('should handle unexpected errors', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('msg', 'Something went wrong, please try again later');
  });
});
