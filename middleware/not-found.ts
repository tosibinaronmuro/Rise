import { StatusCodes } from 'http-status-codes';
import { NotFound } from '../errors';
import { Request, Response } from 'express';

const notFoundHandler = (req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).send('Route does not exist');
};

export default notFoundHandler;
