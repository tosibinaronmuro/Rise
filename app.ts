import dotenv from "dotenv"
import CustomError from "errors/custom-error"
import express, { Express, Request, Response,NextFunction } from "express"
const app:Express=express()
import errorHandler from "middleware/errors-handler"
import notFoundHandler from "middleware/not-found"


app.use(errorHandler)
app.use(notFoundHandler)
 app.get('/', (req:Request,res:Response)=>{
    res.status(200).send('testing typescript which works and testing automation ')
 })
 app.post('/custom-error', (req, res, next) => {
    next(new CustomError('Custom error message'));
  });
  


const port = process.env.PORT || 8000
app.listen(port, ()=>{
    console.log(`app is listening on port ${port}`)
})