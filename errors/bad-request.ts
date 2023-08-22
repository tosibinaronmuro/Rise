import CustomError from "./custom-error";
import { StatusCodes } from "http-status-codes";

class BadRequest extends CustomError {
  status: number;

  constructor(message: string) {
    super(message);
    this.status = StatusCodes.BAD_REQUEST;  
  }
}

export default BadRequest;
