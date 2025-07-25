import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client
const prisma = new PrismaClient();


export const getAllTransactions = async (req, res) => {
  try {
    
    const transactions = await prisma.transaction.findMany();

    // Here we are Get and check is there any transaction is found in db

    if(transactions.length === 0){
      return res.status(404).json({
        success :false,
        message : "No transaction found"
      })
    }

    const getInuseDatas = transactions.filter(e => e.type.toLowerCase() === "inuse" )

    
    res.status(200).json({
      success: true,
      count: getInuseDatas.length,
      data: getInuseDatas,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error while fetching transactions.",
    });
  }
};
