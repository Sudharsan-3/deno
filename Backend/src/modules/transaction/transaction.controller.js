import { transactionRepository, transactionService } from "./index.js"

// update transaction

export const updateTransaction = async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const createdById = req.result?.id; // Assuming authentication middleware
      const reason = req.body.changeReason || "No reason provided";
      console.log(id,req.body,"from controller")
      const updatedTransaction = await transactionService.updateTransactionWithSnapshot(
        id,
        updateData,
        createdById,
        reason
      );
  
      res.status(200).json({
        message: "Transaction updated successfully",
        data: updatedTransaction
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  

// Get transactions
export const getTransaction = async(req,res,next)=>{
    try {
            const transactionData = await transactionService.getTransaction();
            if(!transactionData){
                return res.status(200).json({
                    success : true,
                    message : "No transaction was founded"
                })
            }
            return res.status(200).json({
                success : true,
                message:"successfully loaded all the transaction",
                data :transactionData
            })
        
    } catch (error) {
    next(error)        
    }
} 

// Delete single and multiple transaction

export const deleteTransaction = async(req,res,next)=>{
    try {
        const {ids} = req.body;
        if (!ids){
            return res.status(400).json({
                success : false,
                message:"Give ids to delete the single or multiple transaction"
            })
        }
        console.log(req.body)
        const data = await transactionService.deleteTransaction(req.body);

        return res.status(200).json({
            success : true,
            message : "Transaction deleted successfully",
            data : data
        })
        
    } catch (error) {
        next(error)
    }
}

// Delete all transactions 

export const deleteAllTransacions = async(req,res,next)=>{
    try {
        const data = await transactionService.deleteAllTransacions();
        if(!data){
            return res.status(404).json({
                success : false,
                message:"No transaction founded to delete"
            })
        }
        return res.status(200).json({
            success : true,
            message : "successfully delete all transactions",
            data : data.len
        })
    } catch (error) {
    next(error)        
    }
}

// Restore transactions 

export const restoreTransaction = async(req,res,next)=>{
    try {
        const {id} = req.body;
        console.log(req.body)
        if(!id) {
            return res.status(400).json({
                success : false,
                message:"Please provide transaction id"
            })            
        }
        const data = await transactionService.restoreTransaction(req.body);
        if(!data){
            return res.status(404).json({
                success : false,
                message:"No transaction founded in histroy"
            })
        }
        return res.status(200).json({
            success :true,
            message : "Transaction restored successfully",
            data : data
        })
    } catch (error) {
    next(error)        
    }
}

// Transaction histroy

export const transactionHistroy = async(req,res,next)=>{
    try {
        const data = await transactionService.transactionHistroy();
        if(!data){
            return res.status(404).json({
                success : false,
                message:"No data founded in histroy"
            })
             }
            return res.status(200).json({
                success : true ,
                message : "Transaction histroy loaded successfully",
                data :data
            })
    } catch (error) {
        next(error)
    }
}

// Transaction summary

export const transactionSummary = async (req,res,next)=>{
    try {
        const data = await transactionService.transactionSummary();
        return res.status(200).json({
            success:true,
            message:"Transaction summary loaded successfully",
            data : data
        })
        
    } catch (error) {
        next(error)
    }
} 
// Transaction search

export const transactionSearch = async (req, res, next) => {
  const { userSearch } = req.body;

  if (!userSearch || typeof userSearch !== "string" || userSearch.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid non-empty search term.",
    });
  }

  try {
    const data = await transactionService.transactionSearch({ userSearch: userSearch.trim() });

    return res.status(200).json({
      success: true,
      message: `${data.filtered.length} transaction(s) found.`,
      data,  // sends { filtered: [...] }
    });
  } catch (error) {
    next(error);
  }
};

// transaction filter

export const transactionFilter = async (req, res, next) => {
  console.log(req.body)
    try {
      const data = await transactionService.transactionFilter(req.body);
      
  
      if (data.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No matching transactions found",
          data: [],
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Transaction filter",
        data,
      });
    } catch (error) {
      next(error);
    }
  };
  

// export csv

// export CSV with filters

export const exportCSV = async (req, res, next) => {
  try {
    const filters = req.body; // get filters from POST body
    const csv = await transactionService.exportCSV(filters);

    if (!csv) {
      return res.status(404).json({
        success: false,
        message: "No data to export as CSV",
      });
    }

    res.header("Content-Type", "text/csv");
    res.attachment("transactions.csv");
    return res.send(csv);

  } catch (error) {
    next(error);
  }
};

// export Excel with filters

export const exportExcel = async (req, res, next) => {
  try {
    const filters = req.body; // get filters from POST body
    const workbook = await transactionService.exportExcel(filters);

    if (!workbook) {
      return res.status(404).json({
        success: false,
        message: "No data to export as Excel",
      });
    }

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=transactions.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    next(error);
  }
};

// Zip files

export const exportTransactionsZipController = async (req, res, next) => {
  try {
    const { format = "csv" } = req.query; // csv or excel

    res.attachment(`transactions_with_attachments.zip`);

    const success = await transactionService.exportTransactionsZip(req.body, format, res);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: "No transactions found to export",
      });
    }
  } catch (error) {
    next(error);
  }
};


// export const exportCSV = async(req,res,next)=>{
//     try {
//         const csv = await transactionService.exportCSV();
    
//         if (!csv) {
//           return res.status(404).json({
//             success: false,
//             message: "No data to export as CSV",
//           });
//         }
    
//         res.header("Content-Type", "text/csv");
//         res.attachment("transactions.csv");
//         return res.send(csv);
        
//     } catch (error) {
//         next(error)
//     }

// }

// //  export excel
// export const exportExcel = async (req, res, next) => {
//   try {
//     const workbook = await transactionService.exportExcel();

//     if (!workbook) {
//       return res.status(404).json({
//         success: false,
//         message: "No data to export as Excel",
//       });
//     }

//     res.setHeader(
//       "Content-Type",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     );
//     res.setHeader("Content-Disposition", "attachment; filename=transactions.xlsx");

//     await workbook.xlsx.write(res);
//     res.end();
//   } catch (error) {
//     next(error);
//   }
// };

// Import transactions files like CSV or Excel


export const importTransactions = async (req, res) => {
  await transactionService.handleTransactionImport(req, res);
};


// import transaction attachments 


export const uploadTransactionFiles = async (req, res) => {
  console.log(req.body)
  const { transactionId, description } = req.body;
  const files = req.files;

  try {
    const result = await transactionService.uploadFiles(transactionId, files, description);
    res.status(200).json({
      success: true,
      message: "Files uploaded and saved",
      data: result,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};


