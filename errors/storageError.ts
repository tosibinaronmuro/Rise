import { StatusCodes } from 'http-status-codes';
import CustomError from './custom-error';

class StorageError extends CustomError {
  statusCodes: number = StatusCodes.NOT_FOUND;

  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, StorageError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

export default StorageError;
