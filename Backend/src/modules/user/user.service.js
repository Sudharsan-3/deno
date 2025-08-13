import bcrybt from "bcryptjs"
import { userRepo } from "./index.js";
import generateToken from "../utils/generateToken.js"

// Register Service



export const register = async ({ name, email, password }) => {
    // Validate inputs
    if (!name || !email || !password) {
        const error = new Error("Name, email, and password are required");
        error.statusCode = 400;
        throw error;
    }

    // Check if user already exists
    const checkUser = await userRepo.findByEmail(email);
    if (checkUser) {
        const error = new Error("You are trying to register with an existing email");
        error.statusCode = 409;
        throw error;
    }

    // Hash password
    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = await userRepo.create({
        name,
        email,
        password: hashedPassword
    });

    // Return safe response (no password)
    return {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
    };
};


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