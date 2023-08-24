import express, { Express, Request, Response,NextFunction } from "express"
const app:Express=express()
import errorHandler from "./middleware/errors-handler"
import notFoundHandler from "./middleware/not-found"
import authRouter from "./routes/auth"
import authAdminRouter from "./routes/auth-admin"
import bucketRouter from "./routes/bucket"
import authMiddleware from './middleware/auth';

 app.use(express.json())
app.use("/api/v1/auth", authRouter); 
app.use("/api/v1/auth/admin", authAdminRouter); 
app.use("/api/v1/bucket",authMiddleware,bucketRouter); 


 app.get('/', (req:Request,res:Response)=>{
    res.status(200).send('testing typescript which works and testing automation ')
 })
  
 app.use(errorHandler)
 app.use(notFoundHandler)


const port = process.env.PORT || 8000
app.listen(port, ()=>{
    console.log(`app is listening on port ${port}`)
})