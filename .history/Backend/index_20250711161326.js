import express from "express"
import { login } from "./Routes/auth/register";

const app = express();
const PORT = 3000;

app.use("/api/login",re)

app.listen(PORT,()=>{
    console.log("Your server is running on port :" , PORT)
})