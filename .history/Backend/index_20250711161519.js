import express from "express"
import {  register } from "./Routes/auth/register";
import bodyParser from "body-parser";

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded)

app.use("/api/register",register)

app.listen(PORT,()=>{
    console.log("Your server is running on port :" , PORT)
})