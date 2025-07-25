import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Initialize Prisma Client
  const prisma = new PrismaClient();
export const register = async (req, res) => {

  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS,10);
   // Destructure request body to extract required fields

  const {name, email, password } = req.body;

  
  if (!name ||!email || !password) {
    return res.status(400).json({
      message: "Enter name, email and password to register user",
    });
  }

  try {
  //  Here we are checking the user email bacause we are not allowing a same email to create multiple account
    
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    

    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    // Here we are encrypting our password to ensure the privacy and store the data in db

    const hashedPawword = await bcrypt.hash(password,saltRounds);

    
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password:hashedPawword, 
      },
    });

    return res.status(201).json({
      email: newUser.email,
      message: "Successfully registered",
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  } finally {

    await prisma.$disconnect();
  }
};
