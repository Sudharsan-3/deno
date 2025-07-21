import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * @desc    Restore a soft-deleted transaction by setting type to "inuse"
 * @route   PATCH /api/transactions/restore
 * @access  Protected (optional middleware)
 */
export const restoreTransactionById = async (req, res) => {
  const { id } = req.body;

  // Validate input
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({
      success: false,
      message: "Invalid or missing transaction ID.",
    });
  }

  try {
    const updatedTransaction = await prisma.transaction.update({
      where: { id: Number(id) },
      data: { type: "inuse" },
    });

    return res.status(200).json({
      success: true,
      message: "Transaction soft restored successfully.",
      data: updatedTransaction,
    });

  } catch (error) {
    // Handle case when ID doesn't exist
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: `Transaction with ID ${id} not found.`,
      });
    }

    console.error("Transaction restore error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to soft restore transaction.",
      error: error.message || "Internal server error",
    });
  }
};
