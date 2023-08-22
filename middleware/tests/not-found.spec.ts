import { StatusCodes } from 'http-status-codes';
import express from 'express';
import request from 'supertest';
import notFoundHandler from '../not-found';  

describe('notFoundHandler', () => {
  const app = express();
  app.use(notFoundHandler);

  it('should return a 404 status code', async () => {
    const response = await request(app).get('/invalid-route');

    expect(response.status).toBe(StatusCodes.NOT_FOUND);
  });

  it('should return the "Route does not exist" message', async () => {
    const response = await request(app).get('/invalid-route');

    expect(response.text).toBe('Route does not exist');
  });
});
