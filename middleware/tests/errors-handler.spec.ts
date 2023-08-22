import { StatusCodes } from 'http-status-codes';
import express from 'express';
import request from 'supertest';
import errorHandler from '../errors-handler';
import CustomError from '../../errors/custom-error';

describe('errorHandler', () => {
  const app = express();
  app.use(errorHandler);

  it('should handle CustomError instances', async () => {
    const errorMessage = 'Custom error message';
    const customError = new CustomError(errorMessage);
    const response = await request(app).post('/custom-error').send(customError);

    expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.body.msg).toBe(errorMessage);
  });

  it('should handle ValidationError', async () => {
    const validationErrors = [
      { message: 'Validation error 1' },
      { message: 'Validation error 2' },
    ];
    const validationError = { name: 'ValidationError', errors: validationErrors };
    const response = await request(app).post('/validation-error').send(validationError);

    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    // Add assertions for the specific error messages
  });

  it('should handle duplicate value error', async () => {
    const duplicateError = {
      code: 11000,
      keyValue: { fieldName: 'value' },
    };
    const response = await request(app).post('/duplicate-error').send(duplicateError);

    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    // Add assertions for the specific error messages
  });

  it('should handle CastError', async () => {
    const castError = {
      name: 'CastError',
      value: 'invalid-id',
    };
    const response = await request(app).post('/cast-error').send(castError);

    expect(response.status).toBe(StatusCodes.NOT_FOUND); // Corrected status code
     
  });

  it('should handle unknown errors', async () => {
    const response = await request(app).post('/unknown-error').send({});

    expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.body.msg).toBe('Something went wrong, please try again later');
  });
});
