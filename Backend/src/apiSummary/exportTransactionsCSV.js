import { PrismaClient } from "@prisma/client";
import { Parser } from "json2csv";


const prisma = new PrismaClient();

// CSV Export
export const exportTransactionsCSV = async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany();

    const fields = [
      { label: "Sl. No", value: "slNo" },
      { label: "Transaction Date", value: "transactionDate" },
      { label: "Value Date", value: "valueDate" },
      { label: "Description", value: "description" },
      { label: "Cheque/Ref No.", value: "chequeOrRef" },
      { label: "Amount", value: "amount" },
      { label: "DR/CR", value: "amountType" },
      { label: "Balance", value: "balance" },
      { label: "Balance DR/CR", value: "balanceType" },
     
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(transactions);

    res.header("Content-Type", "text/csv");
    res.attachment("transactions.csv");
    return res.send(csv);
  } catch (error) {
    console.error("Error exporting CSV:", error);
    res.status(500).json({ success: false, message: "CSV export failed" });
  }
};