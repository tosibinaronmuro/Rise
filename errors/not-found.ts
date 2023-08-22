import CustomError from "./custom-error";
import { StatusCodes } from "http-status-codes";

class NotFound extends CustomError{
    status: number;

    constructor(message: string) {
      super(message);
      this.status = StatusCodes.NOT_FOUND;
    }

}

export default NotFound