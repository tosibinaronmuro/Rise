import Unauthenticated from "../unauthenticated";
import { StatusCodes } from "http-status-codes";

describe("unauthenticated class",()=>{
    it("should set status and message correctly",()=>{
        const message="please provide token"
        const unauthenticated=new Unauthenticated(message)
        expect(unauthenticated.message).toBe(message)
        expect(unauthenticated.status).toBe(StatusCodes.UNAUTHORIZED)
    });
    it("should inherit from CustomError", () => {
        const message = "Unauthenticated";
        const badRequest = new Unauthenticated(message);
    
        expect(badRequest instanceof Error).toBe(true);  
      });
})