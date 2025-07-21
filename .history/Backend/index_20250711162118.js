import express from "express"
import bodyParser from "body-parser";
import { register as userRegister } from "./Routes/auth/";

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({extended:true}))

app.use("/api/register",userRegister)

app.listen(PORT,()=>{
    console.log("Your server is running on port :" , PORT)
})