import BadRequest from "../bad-request";
import { StatusCodes } from "http-status-codes";

describe("BadRequest class", () => {
  it("should set status and message correctly", () => {
    const message = "Bad Request";
    const badRequest = new BadRequest(message);

    expect(badRequest.message).toBe(message);
    expect(badRequest.status).toBe(StatusCodes.BAD_REQUEST);
    expect(badRequest instanceof BadRequest).toBe(true);  
  });

  it("should inherit from CustomError", () => {
    const message = "Bad Request";
    const badRequest = new BadRequest(message);

    expect(badRequest instanceof Error).toBe(true);  
  });
});
