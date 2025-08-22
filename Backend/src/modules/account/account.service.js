import { accountRepository } from "./index.js";

// userInfo

export const userInfo = async({id})=>{
    const data = await accountRepository.userInfo(id)
    if(!data){
        return null
    }
    return data
}

// Account by user 

export const getAccountByUser = async({id})=>{

        const data = await accountRepository.accountByUser(id)
        if(!data){
            return null
        }
        return data
}


// Create new account details
export const accountDetail = async ({
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
}) =>{
    
    const checkAccNo = await accountRepository.findUnique(accountNo)
    
    if(checkAccNo){
       return null
        // const error  = new Error ("The account number you entered is already inuse")
        // error.statusCode = 409;
        // throw error
    }
    
    const newAccount = await accountRepository.create(
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
    )
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

export const updateAccount = async ({
    accountId,
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
}) => {
    const checkAccountById = await accountRepository.findAcountById(accountId);
    if (!checkAccountById) {
        const error = new Error("No account was found");
        error.statusCode = 404;
        throw error;
    }

    const sanitize = (value) => (value === '' ? null : value);

    const updateAccountDetails = await accountRepository.update(
        accountId,
        sanitize(name),
        sanitize(address),
        sanitize(custRelnNo),
        sanitize(accountNo),
        sanitize(startDate),
        sanitize(endDate),
        sanitize(currency),
        sanitize(branch),
        sanitize(ifsc),
        sanitize(micr)
    );

    return updateAccountDetails;
};

// deleteAccount



export const deleteAccount = async (accountId) => {
    const account = await accountRepository.checkAccount(accountId);
    if (!account) {
        throw new Error("Account not found");
    }
    return accountRepository.deleteById(accountId);
};

