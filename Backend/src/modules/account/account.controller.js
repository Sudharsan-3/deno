import { accountService } from "./index.js";

// userInfo 

export const userInfo = async(req,res,next)=>{
    const {id} = req.result ;
    console.log(id,"from account details")
    if(!id){
        return res.status(404).json({
            success:false,
            message:"Enter the user id to get the accounts"
        })
    }
    try {
        const data =  await accountService.userInfo(req.result)
        if(!data){
            return res.status(404).json({
                success:false,
                message:"User info not founded"
            })
        }
        return res.status(201).json({
            success : true,
            message : "User info loaded successfully",
            length :data.length,
            data 
        })
        
    } catch (error) {
        next(error)
        console.log(error)
        
    }
}

// get accountBy id 
export const getAccountByUser =async(req,res,next) =>{
    
    const id= req.result.id;
    console.log(id)
    if(!id){
        return res.status(404).json({
            success:false,
            message:"Enter the user id to get the accounts"
        })
    }
    try {
        const resp  = await accountService.getAccountByUser(req.result)
        if(!res){
            return res.status(404).json({
                success:false,
                message:"No Account found by the userId create account"
            })
        }
        return res.status(201).json({
            success : true,
            message : "Account loaded successfully",
            length :resp.length,
            data : resp
        })

        
    } catch (error) {
        next(error)
        
    }
}

// Account details upload 
export const accountDetail = async (req, res, next) => {
   
    const {
        createdById,
        name,
        address,
        custRelnNo,
        accountNo,
        startDate,
        endDate,
        currency,
        branch,
        ifsc,
        micr
    } = req.body;
    console.log(typeof(Number(createdById)))
    console.log(req.body)
    try {
        if (!createdById || !name || !address || !accountNo || !branch || !ifsc || !micr) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields. Please ensure all mandatory fields are provided: createdBy, name, address, accountNo, branch, IFSC, MICR."
            })
        }
        const newAccount = await accountService.accountDetail(req.body)
        if (!newAccount){
            return res.status(409).json({
                success: false,
                message: "The account number you entered is already inuse",
                data: newAccount
            })
        }
        res.status(201).json({
            success: true,
            message: "Account data saved successfully",
            data: newAccount
        }
        )

    } catch (error) {
        next(error)

    }
}

// Get account details

export const getAccount = async (req, res, next) => {
    try {
        const getAccount = await accountService.getAccount();
        if (!getAccount) {
            return res.status(404).json({
                success: false,
                message: "No accounts founded"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Account data loaded successfully",
            data: getAccount,
        })

    } catch (error) {
        next(error)

    }
}

// Updata account details

export const updateAccount = async (req, res, next) => {
    const accountData = (req.body)
    console.log(accountData,"from updateacount")
    try {
        if (!accountData) {
            res.status(400).json({
                success: false,
                message: "Provid the acccount id to find a acccount to update"
            })
        }
        const updateAccountDetails = await accountService.updateAccount(req.body);
        if(!updateAccountDetails){
            res.status(400).json({
                success: false,
                message: "No acccount found with the id"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Account details update successfully",
            data: updateAccountDetails
        })
    } catch (error) {
        next(error)
    }
}

// Delete account




export const deleteAccount = async (req, res, next) => {
    try {
        const { accountId } = req.body;

        if (!accountId) {
            return res.status(400).json({
                success: false,
                message: "Account ID is required"
            });
        }

        await accountService.deleteAccount(accountId);

        return res.status(200).json({
            success: true,
            message: `Account with ID ${accountId} deleted successfully`
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to delete account"
        });
    }
};


