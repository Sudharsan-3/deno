import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  const prisma = new PrismaClient();
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS,10);


  const {name, email, password } = req.body;

  
  if (!name ||!email || !password) {
    return res.status(400).json({
      message: "Enter name, email and password to register user",
    });
  }

  try {
    
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    

    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }
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
