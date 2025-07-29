import { accountService } from "./index.js";


// Account details upload 
export const accountDetail = async (req, res, next) => {
   
    const {
        createdBy,
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
    try {
        if (!createdBy || !name || !address || !accountNo || !branch || !ifsc || !micr) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields. Please ensure all mandatory fields are provided: createdBy, name, address, accountNo, branch, IFSC, MICR."
            })
        }
        const newAccount = await accountService.accountDetail(req.body)
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


