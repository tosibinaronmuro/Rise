// import corsOptionsMiddleware from "../corsOptions";
// import allowedOrigins from "../allowedOrigins";

// describe("corsOptionsMiddleware", () => {
//   it("should allow origins in the allowedOrigins list", () => {
//     const origin = allowedOrigins[0]; // Assuming you have at least one allowed origin
//     const callback = jest.fn();

//     corsOptionsMiddleware.origin!(origin, callback);

//     expect(callback).toHaveBeenCalledWith(null, true);
//   });

//   it("should allow requests with undefined origin", () => {
//     const origin = undefined;
//     const callback = jest.fn();

//     corsOptionsMiddleware.origin!(origin, callback);

//     expect(callback).toHaveBeenCalledWith(null, true);
//   });

//   it("should disallow origins not in the allowedOrigins list", () => {
//     const origin = "http://example.com"; // An origin not in the allowedOrigins list
//     const callback = jest.fn();

//     corsOptionsMiddleware.origin!(origin, callback);

//     expect(callback).toHaveBeenCalledWith(new Error('Not allowed by CORS'), false);
//   });
// });
