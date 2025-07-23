import ExcelJS from "exceljs";
import { PrismaClient } from "@prisma/client";
export const exportTransactionsExcel = async (req, res) => {
    const prisma = new PrismaClient()
    try {
      const transactions = await prisma.transaction.findMany();
  
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Transactions");
  
      worksheet.columns = [
        { header: "Sl. No", key: "slNo", width: 10 },
        { header: "Transaction Date", key: "transactionDate", width: 20 },
        { header: "Value Date", key: "valueDate", width: 20 },
        { header: "Description", key: "description", width: 30 },
        { header: "Cheque/Ref No.", key: "chequeOrRef", width: 20 },
        { header: "Amount", key: "amount", width: 15 },
        { header: "DR/CR", key: "amountType", width: 10 },
        { header: "Balance", key: "balance", width: 15 },
        { header: "Balance DR/CR", key: "balanceType", width: 15 },
        
      ];
  
      transactions.forEach((txn) => worksheet.addRow(txn));
  
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", "attachment; filename=transactions.xlsx");
  
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error("Error exporting Excel:", error);
      res.status(500).json({ success: false, message: "Excel export failed" });
    }
  };