import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config();

export const login = async (req, res) => {
  const prisma = new PrismaClient();
  const secretKey = process.env.SECRETTOKEN

  const { email, password } = req.body;

  console.log(req.body)
  if (!email || !password) {
    return res.status(400).json({
      message: "Enter both email and password",
    });
  }

  try {
   
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: `Email ${email} not found. Please register first.`,
      });
    }
    const comparePassword = await bcrypt.compare(password,user.password)
    
    if (!comparePassword) {
      return res.status(401).json({
        email,
        message: "Password is incorrect",
      });
    }

    const token =  jwt.sign({id:user.id,name:user.name,email:user.email},secretKey,{
      expiresIn:"24hr"
    })

   
    return res.status(200).json({
      Name : user.name,
      Email :user.email,
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
