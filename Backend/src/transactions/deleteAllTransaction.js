import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client
const prisma = new PrismaClient();

export const deleteAllTransaction = async (req, res) => {
  try {
    // Here we are deleting all the data in transaction
    await prisma.transactionFile.deleteMany();
    const result = await prisma.transaction.deleteMany();
    

    return res.status(200).json({
      success: true,
      message: `${result.count} transaction(s) deleted successfully.`,
    });
  } catch (error) {
    console.error("Error deleting all transactions:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while deleting all transactions.",
    });
  }
};
