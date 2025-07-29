import { accountRepository } from "./index.js";

// Create new account details
export const accountDetail = async ({
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
}) =>{
    
    const checkAccNo = await accountRepository.findUnique(accountNo)
    
    if(checkAccNo){
        const error  = new Error ("The account number you entered is already inuse")
        error.statusCode = 409;
        throw error
    }
    
    const newAccount = await accountRepository.create({
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
    })
    return{
        newAccount
    }
}

// Get account details

export const getAccount = async()=>{
   
    const getAccountDetail = await accountRepository.findMany();
    return (getAccountDetail)
}

// Update Account Details

export const updateAccount = async({
    accountId,
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
}) =>{
    const checkAccountById = await accountRepository.findAcountById(accountId)
   
        if (!checkAccountById){
            const error  = new Error ("No account was founded")
            error.statusCode = 404;
            throw error
        }
        
    const updateAccountDetails = await accountRepository.update(
    accountId,
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
    )

    return {
        updateAccountDetails
    }
}

// deleteAccount

export const deleteAccount = async ({id})=>{
    const acccountId = Number(id)
    const deleteAccount = await accountRepository.deleteById(acccountId);
    return (
        deleteAccount
    )

}
