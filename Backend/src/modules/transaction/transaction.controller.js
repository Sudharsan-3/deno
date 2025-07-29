import { transactionService } from "./index.js"

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
        error(next)
        
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

export const transactionSearch  = async(req,res,next)=>{
    const { userSearch } = req.body;

    if (!userSearch || typeof userSearch !== "string") {
        return res.status(400).json({
            success: false,
            message: "Please provide a valid search term.",
        });
    }
    try {
        const data = await transactionService.transactionSearch(req.body)

        return res.status(200).json({
            success: true,
            message: `${data.length} transaction(s) found.`,
            data: data,
        });
    } catch (error) {
        next(error)
    }

}
// transaction filter

export const transactionFilter = async(req,res,next)=>{

    try {
        const data = await transactionService.transactionFilter(req.body);
        return res.status(200).json({
            success:true,
            message : "Transaction filter",
            data : data
        })

        
    } catch (error) {
        next(error)
    }
}

// export csv

export const exportCSV = async(req,res,next)=>{
    try {
        const csv = await transactionService.exportCSV();
    
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
        next(error)
    }

}


