import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

/**
 * @desc   Fetch all transactions from the database
 * @route  GET /api/transactions
 * @access Public (or add middleware for protection)
 */
export const getAllTransactions = async (req, res) => {
  try {
    
    const transactions = await prisma.transaction.findMany();

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
