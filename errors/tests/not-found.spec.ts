import NotFound from "../not-found";
import { StatusCodes } from "http-status-codes";

describe("NotFound class", () => {
    it("should set status and message correctly", () => {
        const message = "Resource not found";
        const notFound = new NotFound(message);

        expect(notFound.message).toBe(message);
        expect(notFound.status).toBe(StatusCodes.NOT_FOUND);
    });
    it("should inherit from CustomError", () => {
        const message = "Not Found";
        const badRequest = new NotFound(message);
    
        expect(badRequest instanceof Error).toBe(true);  
      });
});

