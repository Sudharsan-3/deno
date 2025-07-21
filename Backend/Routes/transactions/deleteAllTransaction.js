import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * @desc    Delete all transactions (use with caution)
 * @route   DELETE /api/transactions/delete-all
 * @access  Admin (recommended to protect this route)
 */
export const deleteAllTransaction = async (req, res) => {
  try {
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
