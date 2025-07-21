import express from "express"
import bodyParser from "body-parser";

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({extended:true}))

app.use("/")

app.listen(PORT,()=>{
    console.log("Your server is running on port :" , PORT)
})