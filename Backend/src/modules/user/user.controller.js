import { userService } from "./index.js";
// Register user controller

export const register = async (req,res,next) =>{
    try {
        const {name,email,password} = req.body
        if(!name || !email || !password){
            return res.status(400).json({
                message: "Enter name, email and password to register user",
              });
        }
        const newUser = await userService.register(req.body);
        
        res.status(201).json(newUser)
    } catch (error) {
        next(error)
    }
}

// Login user controller

export const login = async (req,res,next)=>{
    try {
        const {email,password} = req.body
        if(!email || !password) {
            return res.status(400).json({
                message: "Enter email and password to login user",
              });
        }
        const data = await userService.login(req.body)
        res.status(200).json({data})
        
    } catch (error) {
        next(error)
    }
}