import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

//  We are now config dotenv to get the datas like secretKey
dotenv.config();

export const login = async (req, res) => {
  const prisma = new PrismaClient();
  const secretKey = process.env.SECRETTOKEN

   // Destructure request body to extract required fields
  const { email, password } = req.body;

  
  if (!email || !password) {
    return res.status(400).json({
      message: "Enter both email and password",
    });
  }

  try {
    // Here we are checking that the user is register in out db for login
    const user = await prisma.user.findUnique({
      where: { email },
    });

    //  If user is not register telling them to register

    if (!user) {
      return res.status(404).json({
        message: `Email ${email} not found. Please register first.`,
      });
    }
    const comparePassword = await bcrypt.compare(password,user.password)
    // Here we are compare the user entered one with  which we stored in db
    if (!comparePassword) {
      return res.status(401).json({
        email,
        message: "Password is incorrect",
      });
    }
    // If user entered correct email and password  giveing him/she a token to access the Content

    const token =  jwt.sign({id:user.id,name:user.name,email:user.email},secretKey,{
      expiresIn:"100hr"
    })

   
    return res.status(200).json({
      name : user.name,
      email :user.email,
      message: "Successfully logged in",      
      token
    }
  );
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
};
