import { accountService } from "./index.js";

// get accountBy id 
export const getAccountByUser =async(req,res,next) =>{
    const {id}= req.body;
    if(!id){
        return res.status(404).json({
            success:false,
            message:"Enter the user id to get the accounts"
        })
    }
    try {
        const resp  = await accountService.getAccountByUser(req.body)
        if(!res){
            return res.status(404).json({
                success:false,
                message:"No Account found by the userId create account"
            })
        }
        return res.status(201).json({
            success : true,
            message : "Account loaded successfully",
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
    const accountId = (req.body)
    console.log(accountId)
    try {
        if (!accountId) {
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
        const accountId = Number(req.body);
        if (!accountId) {
            return res.status(404).json({
                message: "No id founded to delete the acccount"
            })
        }
        await accountService.deleteAccount(req.body)
        return res.status(200).json({
            success: true,
            message: "Account deleted successfully",

        })

    } catch (error) {
        next(error)
    }
}


