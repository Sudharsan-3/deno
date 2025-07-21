import express from "express"
import bodyParser from "body-parser";
import { register  } from "./Routes/auth/register";

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json())

app.use("/api/register",re)

app.listen(PORT,()=>{
    console.log("Your server is running on port :" , PORT)
})