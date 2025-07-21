import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

/**
 * @desc Get all accounts from the database
 * @route GET /api/accounts
 * @access Public or Protected (based on your route setup)
 */
export const readAccountD = async (req, res) => {
  try {
   
    const accounts = await prisma.account.findMany();

    
    res.status(200).json({
      success: true,
      data: accounts,
    });
  } catch (error) {
    console.error("Error fetching accounts:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch accounts. Internal server error.",
    });
  }
};
