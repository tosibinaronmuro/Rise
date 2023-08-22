import express, { Express, Request, Response,NextFunction } from "express"
const app:Express=express()
import errorHandler from "./middleware/errors-handler"
import notFoundHandler from "./middleware/not-found"
import AuthRouter from "./routes/auth"

 app.use(express.json())
app.use("/api/v1/auth", AuthRouter); 


 app.get('/', (req:Request,res:Response)=>{
    res.status(200).send('testing typescript which works and testing automation ')
 })
  
 app.use(errorHandler)
 app.use(notFoundHandler)


const port = process.env.PORT || 8000
app.listen(port, ()=>{
    console.log(`app is listening on port ${port}`)
})