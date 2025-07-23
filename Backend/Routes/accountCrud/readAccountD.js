import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client

const prisma = new PrismaClient();


export const readAccountD = async (req, res) => {
  try {
   // Get all the account which we store that in backend
    const accounts = await prisma.account.findMany();

    // If there is no account is found this will run

    if(!accounts){
     return res.status(404).json({
        success : false,
        message : "No accounts finded"
      })
    }

    
    return res.status(200).json({
      success: true,
      data: accounts,
    });
  } catch (error) {
    

    return res.status(500).json({
      success: false,
      message: "Failed to fetch accounts. Internal server error.",
    });
  }
};
