import express from "express"
import { login, register } from "./Routes/auth/register";

const app = express();
const PORT = 3000;

app.use("/api/login",register)

app.listen(PORT,()=>{
    console.log("Your server is running on port :" , PORT)
})