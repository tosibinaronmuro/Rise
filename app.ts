import dotenv from "dotenv"
import express, { Express, Request, Response,NextFunction } from "express"
const app:Express=express()

 app.get('/', (req:Request,res:Response)=>{
    res.status(200).send('testing typescript which works and testing automation ')
 })


const port = process.env.PORT || 8000
app.listen(port, ()=>{
    console.log(`app is listening on port ${port}`)
})