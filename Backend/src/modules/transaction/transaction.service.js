import { transactionRepository } from "./index.js"

// update transaction



export const updateTransactionWithSnapshot = async (id, updateData, createdById, reason) => {
  // 1. Get current transaction from DB
  console.log(updateData)
  const existingTransaction = await transactionRepository.uniqueTransactionById(id)

  if (!existingTransaction) {
    throw new Error("Transaction not found");
  }

  // 2. Create snapshot before updating
  await transactionRepository.createTransactionSnapshot(existingTransaction, createdById, reason);

  // 3. Update transaction
  return transactionRepository.updateTransactionById(id, updateData,reason);
};


// Get all transactions 

export const getTransaction = async () => {
  const data = await transactionRepository.getAllTransactionInuse();

  return data
}

// get transaction histroy

export const transactionHistroy = async () => {
  const data = await transactionRepository.getAllTransactionDeleted();
  return data;
}

// Delete multiple transaction

export const deleteTransaction = async ({ ids }) => {
  const id = ids
  return await transactionRepository.deleteMultipleTransaction(id);

}

// Resotre transaction

export const restoreTransaction = async ({ id }) => {
  const checkTransaction = await transactionRepository.uniqueTransactionById(id)
  if (!checkTransaction) {
    return null
  }
  const data = await transactionRepository.restore(id)
  console.log(id, "transactionService")
  return data
}

// Delete all transaction

export const deleteAllTransacions = async () => {
  return await transactionRepository.deleteAllTransacion();
}

// Get transaction summary

export const transactionSummary = async () => {
  const data = await transactionRepository.getAllTransactionInuse();
  if (data.length === 0) {
    const error = new Error("No transaction founded");
    error.statusCode = 404;
    throw error
  }

  let totalIncome = 0;
  let totalExpense = 0;
  let totalBalance = 0;

  data.forEach((txn) => {
    const amount = txn.amount || 0;
    const balance = txn.balance || 0;

    // In this we are seprating our transaction by credited,debited and balance

    if (txn.amountType?.toLowerCase() === 'cr') {
      totalIncome += amount;
    } else if (txn.amountType?.toLowerCase() === 'dr') {
      totalExpense += amount;
    }

    totalBalance += balance;
  });

  return {
    totalIncome,
    totalExpense,
    netProfit: totalIncome - totalExpense,
    totalBalance
  }

}

//  Transaction Search

export const transactionSearch = async ({ userSearch }) => {
  const data = await transactionRepository.getAllTransactionInuse();

  const searchTerm = userSearch.trim().toLowerCase();

  const filtered = data.filter((t) => {
    return (
      (t.description?.toLowerCase().includes(searchTerm)) ||
      (t.chequeOrRef?.toLowerCase().includes(searchTerm)) ||
      (t.amountType?.toLowerCase().includes(searchTerm)) ||
      (t.balanceType?.toLowerCase().includes(searchTerm)) ||
      (t.amount?.toString().includes(searchTerm))  // numeric search support
    );
  });

  // Instead of throwing error, just return empty array for no results
  return { filtered };
};


// Transaction filter

// export const transactionFilter = async ({
//   date,
//   description,
//   refNo,
//   crMin,
//   crMax,
//   drMin,
//   drMax,
//   tt,
//   attachment,
//   startDate,
//   endDate,
// }) => {
//   console.log(startDate, endDate, "from the transactionService");

//   // Fetch all transactions first
//   const data = await transactionRepository.filter();

//   if (!data || data.length === 0) {
//     return { message: "No transactions found", data: [] };
//   }

//   const filtered = data.filter((txn) => {
//     const txnDate = txn.transactionDate ? new Date(txn.transactionDate) : null;

//     // Single date match (if 'date' is provided)
//     const inputDateObj = date ? new Date(date) : null;
//     const dateMatch = date
//       ? txnDate &&
//         txnDate.getFullYear() === inputDateObj.getFullYear() &&
//         txnDate.getMonth() === inputDateObj.getMonth() &&
//         txnDate.getDate() === inputDateObj.getDate()
//       : true;

//     // Date range match (if startDate and endDate are provided)
//     let rangeMatch = true;
//     if (startDate && endDate && txnDate) {
//       const start = new Date(startDate);
//       const end = new Date(endDate);
//       rangeMatch = txnDate >= start && txnDate <= end;
//     } else if (startDate && txnDate) {
//       rangeMatch = txnDate >= new Date(startDate);
//     } else if (endDate && txnDate) {
//       rangeMatch = txnDate <= new Date(endDate);
//     }

//     const descriptionMatch = description
//       ? txn.description?.toLowerCase().includes(description.toLowerCase())
//       : true;

//     const refNoMatch = refNo
//       ? txn.chequeOrRef?.toLowerCase().includes(refNo.toLowerCase())
//       : true;

//     const ttMatch = tt ? txn.amountType?.toLowerCase() === tt.toLowerCase() : true;

//     const attachmentMatch = attachment
//       ? Array.isArray(txn.files) && txn.files.length > 0
//       : true;

//     // --- Amount Filtering ---
//     const amount = Number(txn.amount) || 0;
//     const type = txn.amountType?.toLowerCase();
//     const crMinVal = crMin !== undefined && crMin !== "" ? Number(crMin) : 0;
//     const crMaxVal = crMax !== undefined && crMax !== "" ? Number(crMax) : 0;
//     const drMinVal = drMin !== undefined && drMin !== "" ? Number(drMin) : 0;
//     const drMaxVal = drMax !== undefined && drMax !== "" ? Number(drMax) : 0;

//     let amountMatch = true;

//     if (type === "cr") {
//       if (crMin !== undefined && crMax !== undefined && crMin !== "" && crMax !== "") {
//         amountMatch = amount >= crMinVal && amount <= crMaxVal;
//       } else if (crMin !== undefined && crMin !== "") {
//         amountMatch = amount >= crMinVal && amount >= 0;
//       } else if (crMax !== undefined && crMax !== "") {
//         amountMatch = amount <= crMaxVal && amount >= 0;
//       } else {
//         amountMatch = amount >= 0;
//       }
//     } else if (type === "dr") {
//       if (drMin !== undefined && drMax !== undefined && drMin !== "" && drMax !== "") {
//         amountMatch = amount >= drMinVal && amount <= drMaxVal;
//       } else if (drMin !== undefined && drMin !== "") {
//         amountMatch = amount >= drMinVal && amount >= 0;
//       } else if (drMax !== undefined && drMax !== "") {
//         amountMatch = amount <= drMaxVal && amount >= 0;
//       } else {
//         amountMatch = amount >= 0;
//       }
//     }

//     // Ignore amounts of other type if min/max for CR/DR is provided
//     if (
//       (type !== "cr" && (crMin !== undefined && crMin !== "" || crMax !== undefined && crMax !== "")) ||
//       (type !== "dr" && (drMin !== undefined && drMin !== "" || drMax !== undefined && drMax !== ""))
//     ) {
//       amountMatch = false;
//     }

//     return dateMatch && rangeMatch && descriptionMatch && refNoMatch && ttMatch && attachmentMatch && amountMatch;
//   });

//   return filtered.length === 0
//     ? { message: "No transactions found", data: [] }
//     : { message: "Transactions found", data: filtered };
// };

export const transactionFilter = async ({
  date,
  description,
  refNo,
  crMin,
  crMax,
  drMin,
  drMax,
  tt,
  attachment,
  startDate,
  endDate,
}) => {
  

  // Fetch all transactions
  const data = await transactionRepository.filter();

  if (!data || data.length === 0) {
    return { message: "No transactions found", data: [] };
  }

  const filtered = data.filter((txn) => {
    const txnDate = txn.transactionDate ? new Date(txn.transactionDate) : null;

    // --- Single date match ---
    const inputDateObj = date ? new Date(date) : null;
    const dateMatch = date
      ? txnDate &&
        txnDate.getFullYear() === inputDateObj.getFullYear() &&
        txnDate.getMonth() === inputDateObj.getMonth() &&
        txnDate.getDate() === inputDateObj.getDate()
      : true;

    // --- Date range match ---
    function normalizeDate(date) {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0); // Reset to midnight
      return d;
    }
    
    let rangeMatch = true;
    if (startDate && endDate && txnDate) {
      const start = normalizeDate(startDate);
      const end = normalizeDate(endDate);
      const txnDay = normalizeDate(txnDate);
      rangeMatch = txnDay >= start && txnDay <= end;
    } else if (startDate && txnDate) {
      const start = normalizeDate(startDate);
      const txnDay = normalizeDate(txnDate);
      rangeMatch = txnDay >= start;
    } else if (endDate && txnDate) {
      const end = normalizeDate(endDate);
      const txnDay = normalizeDate(txnDate);
      rangeMatch = txnDay <= end;
    }
    

    // --- Description match ---
    const descriptionMatch = description
      ? txn.description?.toLowerCase().includes(description.toLowerCase())
      : true;

    // --- Ref/Cheque match ---
    const refNoMatch = refNo
      ? txn.chequeOrRef?.toLowerCase().includes(refNo.toLowerCase())
      : true;

    // --- Transaction type match ---
    const ttMatch = tt ? txn.amountType?.toLowerCase() === tt.toLowerCase() : true;

    // --- Attachment check ---
    const attachmentMatch = attachment
      ? Array.isArray(txn.files) && txn.files.length > 0
      : true;

    // --- Amount Filtering ---
    const amount = Number(txn.amount) || 0;
    const type = txn.amountType?.toLowerCase();
    const crMinVal = crMin !== undefined && crMin !== "" ? Number(crMin) : 0;
    const crMaxVal = crMax !== undefined && crMax !== "" ? Number(crMax) : 0;
    const drMinVal = drMin !== undefined && drMin !== "" ? Number(drMin) : 0;
    const drMaxVal = drMax !== undefined && drMax !== "" ? Number(drMax) : 0;

    let amountMatch = true;

    if (type === "cr") {
      if (crMin !== undefined && crMax !== undefined && crMin !== "" && crMax !== "") {
        amountMatch = amount >= crMinVal && amount <= crMaxVal;
      } else if (crMin !== undefined && crMin !== "") {
        amountMatch = amount >= crMinVal;
      } else if (crMax !== undefined && crMax !== "") {
        amountMatch = amount <= crMaxVal;
      }
    } else if (type === "dr") {
      if (drMin !== undefined && drMax !== undefined && drMin !== "" && drMax !== "") {
        amountMatch = amount >= drMinVal && amount <= drMaxVal;
      } else if (drMin !== undefined && drMin !== "") {
        amountMatch = amount >= drMinVal;
      } else if (drMax !== undefined && drMax !== "") {
        amountMatch = amount <= drMaxVal;
      }
    }

    // Ignore amounts of other type if min/max for CR/DR is provided
    if (
      (type !== "cr" && (crMin !== undefined && crMin !== "" || crMax !== undefined && crMax !== "")) ||
      (type !== "dr" && (drMin !== undefined && drMin !== "" || drMax !== undefined && drMax !== ""))
    ) {
      amountMatch = false;
    }

    // --- Final filter ---
    return dateMatch && rangeMatch && descriptionMatch && refNoMatch && ttMatch && attachmentMatch && amountMatch;
  });

  return filtered.length === 0
    ? { message: "No transactions found", data: [] }
    : { message: "Transactions found", data: filtered };
};

// export const transactionFilter = async ({
//   date,
//   description,
//   refNo,
//   crMin,
//   crMax,
//   drMin,
//   drMax,
//   tt,
//   attachment,
//   startDate,
//   endDate,
// }) => {
//   console.log(startDate,endDate ,"from the transactionService")
//   // Fetch all transactions first
//   const data = await transactionRepository.filter();

//   if (!data || data.length === 0) {
//     return { message: "No transactions found", data: [] };
//   }

//   const filtered = data.filter((txn) => {
//     const txnDate = txn.transactionDate ? new Date(txn.transactionDate) : null;
//     const inputDateObj = date ? new Date(date) : null;

//     const dateMatch = date
//       ? txnDate &&
//       txnDate.getFullYear() === inputDateObj.getFullYear() &&
//       txnDate.getMonth() === inputDateObj.getMonth() &&
//       txnDate.getDate() === inputDateObj.getDate()
//       : true;

//     const descriptionMatch = description
//       ? txn.description?.toLowerCase().includes(description.toLowerCase())
//       : true;

//     const refNoMatch = refNo
//       ? txn.chequeOrRef?.toLowerCase().includes(refNo.toLowerCase())
//       : true;

//     const ttMatch = tt
//       ? txn.amountType?.toLowerCase() === tt.toLowerCase()
//       : true;

//     const attachmentMatch = attachment
//       ? Array.isArray(txn.files) && txn.files.length > 0
//       : true;

//     // --- Amount Filtering ---
//     const amount = Number(txn.amount) || 0;
//     const type = txn.amountType?.toLowerCase();

//     // Default ranges
//     const crMinVal = crMin !== undefined && crMin !== "" ? Number(crMin) : 0;
//     const crMaxVal = crMax !== undefined && crMax !== "" ? Number(crMax) : 0;
//     const drMinVal = drMin !== undefined && drMin !== "" ? Number(drMin) : 0;
//     const drMaxVal = drMax !== undefined && drMax !== "" ? Number(drMax) : 0;

//     let amountMatch = true;

//     if (type === "cr") {
//       if (crMin !== undefined && crMax !== undefined && crMin !== "" && crMax !== "") {
//         // Both min and max provided
//         amountMatch = amount >= crMinVal && amount <= crMaxVal;
//       } else if (crMin !== undefined && crMin !== "") {
//         // Only min provided
//         amountMatch = amount >= crMinVal && amount >= 0;
//       } else if (crMax !== undefined && crMax !== "") {
//         // Only max provided
//         amountMatch = amount <= crMaxVal && amount >= 0;
//       } else {
//         // No filters for CR
//         amountMatch = amount >= 0;
//       }
//     } else if (type === "dr") {
//       if (drMin !== undefined && drMax !== undefined && drMin !== "" && drMax !== "") {
//         amountMatch = amount >= drMinVal && amount <= drMaxVal;
//       } else if (drMin !== undefined && drMin !== "") {
//         amountMatch = amount >= drMinVal && amount >= 0;
//       } else if (drMax !== undefined && drMax !== "") {
//         amountMatch = amount <= drMaxVal && amount >= 0;
//       } else {
//         amountMatch = amount >= 0;
//       }
//     }

//     // If min/max provided for CR or DR, ignore amounts of other type
//     if (
//       (type !== "cr" &&
//         (crMin !== undefined && crMin !== "" || crMax !== undefined && crMax !== "")) ||
//       (type !== "dr" &&
//         (drMin !== undefined && drMin !== "" || drMax !== undefined && drMax !== ""))
//     ) {
//       amountMatch = false;
//     }

//     return (
//       dateMatch &&
//       descriptionMatch &&
//       refNoMatch &&
//       ttMatch &&
//       attachmentMatch &&
//       amountMatch
//     );
//   });

//   return filtered.length === 0
//     ? { message: "No transactions found", data: [] }
//     : { message: "Transactions found", data: filtered };
// };



// export csv

// src/modules/transaction/transaction.service.js

import { Parser } from "json2csv";
import ExcelJS from "exceljs";


export const exportCSV = async (filters) => {
  // Apply filtering using your existing filter function
  const filteredTransactions = await transactionFilter(filters);

  const transactions = filteredTransactions.data || [];

  if (!transactions || transactions.length === 0) {
    return null;
  }

  // Add Sl. No dynamically
  const transactionsWithSlNo = transactions.map((t, index) => ({
    slNo: index + 1,
    ...t,
  }));

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
    { label: "Invoice", value: "invoice" },
  ];

  const parser = new Parser({ fields });
  const csv = parser.parse(transactionsWithSlNo);

  return csv;
};

export const exportExcel = async (filters) => {
  const filteredTransactions = await transactionFilter(filters);
  const transactions = filteredTransactions.data || [];

  if (!transactions || transactions.length === 0) {
    return null;
  }

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

  transactions.forEach((txn, index) =>
    worksheet.addRow({
      slNo: index + 1,
      ...txn,
    })
  );

  return workbook;
};

// import { Parser } from "json2csv";
// import ExcelJS from "exceljs";
import archiver from "archiver";
// import fs from "fs";
import path from "path";
// import { transactionFilter } from "./transaction.service.filter.js"; // adjust import path

export const exportTransactionsZip = async (filters, format, outputStream) => {
  // 1️⃣ Get filtered transactions
  const filtered = await transactionFilter(filters);
  const transactions = filtered.data || [];
  console.log(transactions,"from the service to zip")
  if (transactions.length === 0) return false;

  // 2️⃣ Create ZIP stream
  const archive = archiver("zip", { zlib: { level: 9 } });
  archive.pipe(outputStream);

  // 3️⃣ Add CSV or Excel
  const transactionsWithSlNo = transactions.map((t, i) => ({ slNo: i + 1, ...t }));

  if (format === "csv") {
    const fields = [
      { label: "Transaction id", value: "id" },
      { label: "Sl. No", value: "slNo" },
      { label: "Transaction Date", value: "transactionDate" },
      { label: "Value Date", value: "valueDate" },
      { label: "Description", value: "description" },
      { label: "Cheque/Ref No.", value: "chequeOrRef" },
      { label: "Amount", value: "amount" },
      { label: "DR/CR", value: "amountType" },
      { label: "Balance", value: "balance" },
      { label: "Balance DR/CR", value: "balanceType" },
      { label: "Invoice", value: "invoice" },
    ];
    const parser = new Parser({ fields });
    const csv = parser.parse(transactionsWithSlNo);
    archive.append(csv, { name: "transactions.csv" });
  } else if (format === "excel") {
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
      { header: "Invoice", key: "invoice", width: 20 },
    ];

    transactionsWithSlNo.forEach((txn) => worksheet.addRow(txn));
    const buffer = await workbook.xlsx.writeBuffer();
    archive.append(buffer, { name: "transactions.xlsx" });
  }

  // 4️⃣ Add all attachments
  for (const txn of transactions) {
    if (Array.isArray(txn.files) && txn.files.length > 0) {
      txn.files.forEach((file, idx) => {
        const filePath = path.resolve(file.filePath);
        if (fs.existsSync(filePath)) {
          archive.file(filePath, {
            name: `attachments/transaction-${txn.id}/${idx + 1}-${file.fileName}`,
          });
        }
      });
    }
  }

  // 5️⃣ Finalize ZIP and return Promise correctly
  return new Promise((resolve, reject) => {
    archive.on("warning", (err) => {
      if (err.code === "ENOENT") console.warn(err); // log missing files
      else reject(err);
    });
    archive.on("error", (err) => reject(err));
    archive.on("finish", () => resolve(true)); // 'finish' fires after finalize completes
    archive.finalize();
  });
};


// import { Parser } from "json2csv";


// export const exportCSV = async () => {
//   const transactions = await transactionRepository.getAllTransactionInuse()

//   if (!transactions || transactions.length === 0) {
//     return null; // handled by controller
//   }

//   // Add Sl. No dynamically
//   const transactionsWithSlNo = transactions.map((t, index) => ({
//     slNo: index + 1,
//     ...t,
//   }));

//   const fields = [
//     { label: "Sl. No", value: "slNo" },
//     { label: "Transaction Date", value: "transactionDate" },
//     { label: "Value Date", value: "valueDate" },
//     { label: "Description", value: "description" },
//     { label: "Cheque/Ref No.", value: "chequeOrRef" },
//     { label: "Amount", value: "amount" },
//     { label: "DR/CR", value: "amountType" },
//     { label: "Balance", value: "balance" },
//     { label: "Balance DR/CR", value: "balanceType" },
//   ];

//   const parser = new Parser({ fields });
//   const csv = parser.parse(transactionsWithSlNo);

//   return csv; // send to controller
// };

// // Export transaction in excel

// import ExcelJS from "exceljs";

// export const exportExcel = async () => {
//   const transactions = await transactionRepository.getAllTransactionInuse();

//   if (!transactions || transactions.length === 0) {
//     return null;
//   }

//   const workbook = new ExcelJS.Workbook();
//   const worksheet = workbook.addWorksheet("Transactions");

//   worksheet.columns = [
//     { header: "Sl. No", key: "slNo", width: 10 },
//     { header: "Transaction Date", key: "transactionDate", width: 20 },
//     { header: "Value Date", key: "valueDate", width: 20 },
//     { header: "Description", key: "description", width: 30 },
//     { header: "Cheque/Ref No.", key: "chequeOrRef", width: 20 },
//     { header: "Amount", key: "amount", width: 15 },
//     { header: "DR/CR", key: "amountType", width: 10 },
//     { header: "Balance", key: "balance", width: 15 },
//     { header: "Balance DR/CR", key: "balanceType", width: 15 },
//   ];

//   transactions.forEach((txn, index) =>
//     worksheet.addRow({
//       slNo: index + 1,
//       ...txn,
//     })
//   );

//   return workbook;
// };

// Import Transactions
// src/modules/transaction/transaction.service.js

import fs from 'fs';
import { processCSV, processExcel, parseAmount, parseDateTime, parseDate, cleanString } from '../utils/transaction.utils.js';
import { createTransactionsInBulk, findUserById, findAccountById } from './transaction.repository.js';

export const handleTransactionImport = async (req, res) => {
  const { userId, accountId } = req.body;
  const file = req.file
  if (!file || !userId || !accountId) {
    return res.status(400).json({ error: 'You have to provide all the things to import transaction like userid , accountid  and file' });
  }

  const filePath = req.file.path;
  const fileExt = req.file.originalname.split('.').pop().toLowerCase();
  const results = [];

  try {
    const { userId, accountId } = req.body;

    const [user, account] = await Promise.all([
      findUserById(Number(userId)),
      findAccountById(Number(accountId))
    ]);

    if (!user) return res.status(404).json({ message: `User not found: ${userId}` });
    if (!account) return res.status(404).json({ message: `Account not found: ${accountId}` });

    if (fileExt === 'csv') {
      await processCSV(filePath, results);
    } else if (fileExt === 'xlsx' || fileExt === 'xls') {
      await processExcel(filePath, results);
    } else {
      throw new Error('Only CSV or Excel files are supported');
    }

    if (results.length === 0) {
      throw new Error('No valid transactions found in file');
    }

    const transactionsToCreate = results.map(txn => {
      const amountType = (txn['Dr / Cr'] || '').toString().trim().toUpperCase();
      const balanceType = (txn['Balance Dr/Cr'] || txn['Dr / Cr.1'] || '').toString().trim().toUpperCase();

      return {
        slNo: parseInt(txn['Sl. No.']) || 0,
        transactionDate: parseDateTime(txn['Transaction Date']),
        valueDate: parseDate(txn['Value Date']),
        description: cleanString(txn['Description']),
        chequeOrRef: cleanString(txn['Chq / Ref No.']),
        amount: parseAmount(txn['Amount']),
        amountType: amountType === 'CR' ? 'CR' : 'DR',
        balance: parseAmount(txn['Balance']),
        balanceType: balanceType === 'DR' ? 'DR' : 'CR',
        createdById: Number(userId),
        accountId: Number(accountId)
      };
    });

    const savedTransactions = await createTransactionsInBulk(transactionsToCreate);

    res.json({
      success: true,
      message: `Successfully saved ${savedTransactions.length} transactions`,
      data: savedTransactions,
    });

  } catch (error) {
    console.error('Transaction processing error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  } finally {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
};

//  transaction attachment



export const uploadFiles = async (transactionId, files, description) => {
  if (!files || files.length === 0) {
    const error = new Error("No files uploaded");
    error.statusCode = 400;
    throw error;
  }

  const transaction = await transactionRepository.uniqueTransactionById(transactionId)

  if (!transaction) {
    const error = new Error("Transaction not found");
    error.statusCode = 404;
    throw error;
  }

  const fileDataArray = files.map((file) => ({
    fileName: file.originalname,
    fileType: file.mimetype,
    filePath: file.path,
    description: description || null,
    transactionId: transaction.id,
  }));

  return await transactionRepository.saveFiles(fileDataArray);
};

