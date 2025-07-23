import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client
const prisma = new PrismaClient();

export const transactionSummary = async (req, res) => {
  // Filtering the transaction type deleted or inuse
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        type: 'inuse'
      }
    });

    let totalIncome = 0;
    let totalExpense = 0;
    let totalBalance = 0;

    transactions.forEach((txn) => {
      const amount = txn.amount || 0;
      const balance = txn.balance || 0;

      if (txn.amountType?.toLowerCase() === 'cr') {
        totalIncome += amount;
      } else if (txn.amountType?.toLowerCase() === 'dr') {
        totalExpense += amount;
      }

      totalBalance += balance;
    });

    return res.status(200).json({
      success: true,
      message: "Transaction summary fetched successfully",
      data: {
        totalIncome,
        totalExpense,
        netProfit: totalIncome - totalExpense,
        totalBalance
      }
    });
  } catch (error) {
    console.error("Error fetching transaction summary:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching transaction summary.",
    });
  }
};
