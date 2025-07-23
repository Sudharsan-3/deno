import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client
const prisma = new PrismaClient(); 

export const history = async (req, res) => {
  try {
  
    // Directly filter in DB query to avoid unnecessary reads
    const deletedTransactions = await prisma.transaction.findMany({
      where: {
        type: {
          equals: 'delete',
          mode: 'insensitive', // case-insensitive match
        },
      },
    });
    

    if (deletedTransactions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No history found",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "History data loaded successfully",
      length: deletedTransactions.length,
      data: deletedTransactions,
    });
  } catch (error) {
    console.error("Error fetching history:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
