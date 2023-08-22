class CustomError extends Error {
  constructor(message: string, public statusCode?: number, public keyValue?: any, public errors?: any[]) {
    super(message);
  }
}

export default CustomError;
