import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * @desc    Soft delete multiple transactions by IDs
 * @route   PUT /api/transactions/bulk-delete
 * @access  Public (add auth if needed)
 */
export const deleteMultipleTransactions = async (req, res) => {
  const { ids } = req.body;

  // Input validation
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid input: 'ids' must be a non-empty array.",
    });
  }

  try {
    const result = await prisma.transaction.updateMany({
      where: {
        id: {
          in: ids.map((id) => Number(id)),
        },
      },
      data: {
        type: "delete", // Mark as deleted instead of removing
      },
    });

    if (result.count === 0) {
      return res.status(404).json({
        success: false,
        message: `No transactions found for IDs: ${ids.join(", ")}.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `${result.count} transaction(s) marked as deleted.`,
      count: result.count,
    });
  } catch (error) {
    console.error("Error deleting transactions:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while deleting transactions.",
      error: error.message || "Unknown error",
    });
  }
};
