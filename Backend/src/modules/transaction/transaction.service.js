import { transactionRepository } from "./index.js"

// Get all transactions 

export const getTransaction = async()=>{
    const data = await transactionRepository.getAllTransactionInuse();
    
    return data
}

// get transaction histroy

export const transactionHistroy = async()=>{
    const data = await transactionRepository.getAllTransactionDeleted();
    return data ;
}

// Delete multiple transaction

export const deleteTransaction = async ({ids})=>{
    const id = ids
    return await transactionRepository.deleteMultipleTransaction(id);
   
}

// Resotre transaction

export const restoreTransaction = async ({id}) =>{
  const checkTransaction = await transactionRepository.uniqueTransactionById(id)
  if(!checkTransaction){
    return null
  }
  const data = await transactionRepository.restore(id)
  console.log(id,"transactionService")
    return data
}

// Delete all transaction

export const deleteAllTransacions = async()=>{
    return await transactionRepository.deleteAllTransacion();
}

// Get transaction summary

export const transactionSummary = async()=>{
    const data = await transactionRepository.getAllTransactionInuse();
    if(data.length ===0){
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
          totalBalance}
        
}

//  Transaction Search

export const transactionSearch = async({userSearch})=>{
    const data = await transactionRepository.getAllTransactionInuse();
    const lowerSearch = userSearch.toLowerCase();
    const filtered = data.filter((t) => {
          return  (t.description?.toLowerCase().includes(lowerSearch) ||
                t.chequeOrRef?.toLowerCase().includes(lowerSearch) ||
                t.amountType?.toLowerCase().includes(lowerSearch) ||
                t.balanceType?.toLowerCase().includes(lowerSearch))

    }
    );
    if(filtered.length === 0){
        const error = new Error(`No data found on search of ${userSearch}`);
        error.statusCode = 404;
        throw error}
    return {
        filtered
    }
}

// Transaction filter

export const transactionFilter = async({
    date,          
    desciption,
    refNo,
    crMin,
    crMax,
    dbMin,
    dbMax,
    tt,         
    attachment,
})=>{
    const data = await transactionRepository.filter( )  

    if (data.length === 0) {
        const error = new Error("No transactions found");
        error.statusCode = 404;
        throw error;
      }
    
      const noFiltersApplied =
        !date &&
        !desciption &&
        !refNo &&
        !attachment &&
        crMin === undefined &&
        crMax === undefined &&
        dbMin === undefined &&
        dbMax === undefined;
    
      const result = (noFiltersApplied
        ? tt
          ? data.filter(
              (item) => item.amountType?.toLowerCase() === tt.toLowerCase()
            )
          : data
        : data.filter((e) => {
            const tDate = e.transactionDate
              ? new Date(e.transactionDate).toISOString().split("T")[0]
              : "";
    
            const inputDate = date
              ? new Date(date).toISOString().split("T")[0]
              : null;
    
            const dateMatch = inputDate ? tDate === inputDate : true;
    
            const descriptionMatch = desciption
              ? e.description
                  ?.toLowerCase()
                  .includes(desciption.toLowerCase())
              : true;
    
            const refNoMatch = refNo
              ? e.chequeOrRef
                  ?.toLowerCase()
                  .includes(refNo.toLowerCase())
              : true;
    
            const typeMatch = tt
              ? e.amountType?.toLowerCase() === tt.toLowerCase()
              : true;
    
            const attachmentMatch = attachment
              ? attachment === "true"
                ? e.files && e.files.length > 0
                : e.files?.some(
                    (file) =>
                      file.fileName
                        ?.toLowerCase()
                        .includes(attachment.toLowerCase()) ||
                      file.description
                        ?.toLowerCase()
                        .includes(attachment.toLowerCase())
                  )
              : true;
    
            const creditMatch =
              e.amountType?.toLowerCase() === "cr"
                ? (crMin === undefined || e.amount >= crMin) &&
                  (crMax === undefined || e.amount <= crMax)
                : true;
    
            const debitMatch =
              e.amountType?.toLowerCase() === "dr"
                ? (dbMin === undefined || e.amount >= dbMin) &&
                  (dbMax === undefined || e.amount <= dbMax)
                : true;
    
            return (
              dateMatch &&
              descriptionMatch &&
              refNoMatch &&
              typeMatch &&
              attachmentMatch &&
              creditMatch &&
              debitMatch
            );
          })
      );
    
      return result;
}

// export csv

// src/modules/transaction/transaction.service.js


import { Parser } from "json2csv";


export const exportCSV = async () => {
  const transactions = await transactionRepository.getAllTransactionInuse()

  if (!transactions || transactions.length === 0) {
    return null; // handled by controller
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
  ];

  const parser = new Parser({ fields });
  const csv = parser.parse(transactionsWithSlNo);

  return csv; // send to controller
};

// Export transaction in excel

import ExcelJS from "exceljs";

export const exportExcel = async () => {
  const transactions = await transactionRepository.getAllTransactionInuse();

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

// Import Transactions
// src/modules/transaction/transaction.service.js

import fs from 'fs';
import { processCSV, processExcel, parseAmount, parseDateTime, parseDate, cleanString } from '../utils/transaction.utils.js';
import { createTransactionsInBulk, findUserById, findAccountById } from './transaction.repository.js';

export const handleTransactionImport = async (req, res) => {
  const {userId,accountId} = req.body;
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

