import express, { Express, Request, Response } from "express"
import adminAuthMiddleware from './middleware/admin-auth'
import authMiddleware from './middleware/auth'
import errorHandler from "./middleware/errors-handler"
import notFoundHandler from "./middleware/not-found"
import authRouter from "./routes/auth"
import authAdminRouter from "./routes/auth-admin"
import bucketRouter from "./routes/bucket"
import bucketAdminRouter from "./routes/bucket-admin"
import helmet from "helmet"
const app:Express=express()

 app.use(express.json())
app.use("/api/v1/auth", authRouter); 
app.use("/api/v1/auth/admin", authAdminRouter); 
app.use("/api/v1/bucket", authMiddleware, bucketRouter);
app.use("/api/v1/admin/bucket", adminAuthMiddleware, bucketAdminRouter);


 app.get('/', (req:Request,res:Response)=>{
    res.status(200).send('Risecloud api base URL <br/><a> Postman Collection: https://documenter.getpostman.com/view/15748545/2s9Y5YSNYg <a/>')
 })
//  app.set("trust proxy", 1);
//  app.use(
//    rateLimiter({
//      windowMs: 15 * 60 * 1000,
//      max: 60,
//      message: 'Too many requests to this endpoint. Please try again later.'
//    })
//  );
//  app.use(helmet());
 
 
 app.use(errorHandler)
 app.use(notFoundHandler)
 


const port = process.env.PORT || 8000
app.listen(port, ()=>{
    console.log(`app is listening on port ${port}`)
})
