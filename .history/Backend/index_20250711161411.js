import express from "express"
import {  register } from "./Routes/auth/register";

const app = express();
const PORT = 3000;



app.use("/api/register",register)

app.listen(PORT,()=>{
    console.log("Your server is running on port :" , PORT)
})