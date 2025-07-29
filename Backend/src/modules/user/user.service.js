import bcrybt from "bcryptjs"
import { userRepo } from "./index.js";
import generateToken from "../utils/generateToken.js"

// Register Service

export const register = async({name,email,password}) =>{
    // checking email id
    const salt = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const checkUser = await userRepo.findByEmail(email);
    if (checkUser){
        const error = new Error("You are trying to register with an existing email");
        error.ststusCode = 409;
        throw error
    }
    const hashedPassword = await bcrybt.hash(password,salt);

    const newUser = await userRepo.create({
        name,email,password:hashedPassword
    })
    return {
        id:newUser.id,
        name:newUser.name,
        email:newUser.email,
    }
}

// Login 
export const login = async ({email,password})=>{
    const user = await userRepo.findByEmail(email);
    if (!user){
        const error = new Error (`User with this email:${email} is not founded`)
        error.ststusCode = 404;
        throw error
    }
    const isMatch = await bcrybt.compare(password,user.password)
    if (!isMatch){
        const error = new Error('You entered a wrong password');
        error.ststusCode = 404;
        throw error
    }
    const token = generateToken(user)
    return token
    
    
}