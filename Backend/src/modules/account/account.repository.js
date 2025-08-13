import prisma from "../prisma/prismaClient.js";

// account by user id

export const accountByUser = async(id)=>{
    return await prisma.account.findMany({
        where :{
            createdById : Number(id)
        }
    })
}

// Account by accountNo

export const findUnique = async(accountNo)=>{
    return await prisma.account.findUnique({
        where :{
            accountNo
        }
    })
}

// Store accountDetail in db using prisma
export const create = async (
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
    micr) => {
        console.log(createdById)
    return prisma.account.create({
        data :{
        createdById:Number(createdById),
        name,
        address,
        custRelnNo,
        accountNo,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        currency,
        branch,
        ifsc,
        micr}
    })
}

// Get accountDetail 

export const findMany = async () => {
    return prisma.account.findMany();
}
// Find Unique acccount
export const findAcountById = async(accountId)=>{
    return await prisma.account.findUnique({
        where : {
            id : Number(accountId)
        }
    })
}
// Update account
export const update = async(
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
    micr) => {
        console.log(accountId,"from accountRepository")
    return await prisma.account.update({
        where: {
            id: Number(accountId)
        }
        , data: {
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
        }
    })

}


// deleteAccount

export const deleteById =  async(AccountId) =>{
    return prisma.account.delete({
        where : {
        id:Number(AccountId)
        }
    })
}

