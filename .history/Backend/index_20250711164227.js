import express from "express"
import bodyParser from "body-parser";
import { register  } from "./Routes/auth/register.js";

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

// 
app.use("/api/register",register)


app.listen(PORT,()=>{
    console.log("Your server is running on port :" , PORT)
})