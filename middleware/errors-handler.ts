import { StatusCodes } from "http-status-codes";
import CustomError  from "../errors/custom-error";
import express from "express";
 
import { Request, Response, NextFunction } from 'express';
 
 


interface CustomErrorResponse {
  msg: string;
  statusCode?: number;
}
 

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let customError: CustomErrorResponse = {
    msg: err.message || 'Something went wrong, please try again later',
  };

  if (err instanceof CustomError) {
    customError.msg = err.message;
    customError.statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

    if (err.keyValue) {
      customError.msg = `Duplicate value entered for ${Object.keys(
        err.keyValue
      )} field, please choose another value`;
      customError.statusCode = StatusCodes.BAD_REQUEST;
    }

    if (err.errors) {
      customError.msg = err.errors
        .map((item: any) => item.message)
        .join(',');
      customError.statusCode = StatusCodes.BAD_REQUEST;
    }
  }
   
  if (err.name === 'CastError') {
    customError.msg = `No item found with id `;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }
  

  return res.status(customError.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: customError.msg });
};

export default errorHandler;
