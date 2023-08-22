import CustomError from "./custom-error";
import { StatusCodes } from "http-status-codes";

class Unauthenticated extends CustomError {
  status: number;

  constructor(message: string) {
    super(message);
    this.status = StatusCodes.UNAUTHORIZED;
  }
}

export = Unauthenticated;
