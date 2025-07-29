import { errorHandler } from "../../middlewares/error.middleware.js";
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
    return await transactionRepository.restore(id)
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

