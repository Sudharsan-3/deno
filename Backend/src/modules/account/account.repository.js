import prisma from "../prisma/prismaClient.js";



export const userInfo = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      Account: {
        include: {
          transactions: true
        }
      },
      Transaction: true,
      TransactionSnapshot: true
    }
  });

  if (!user) return null;

  // 🧮 Overall counts
  const accountCount = user.Account.length;

  const transactionsFromUser = user.Transaction;
  const allTransactions = [ ...transactionsFromUser];
  const transactionCount = allTransactions.length;
  const snapshotCount = user.TransactionSnapshot.length;
  const inuseTransactions = transactionsFromUser.filter((e) => e.type.toLocaleLowerCase() === "inuse")
  const deleteTransactions = transactionsFromUser.filter((e) => e.type.toLocaleLowerCase() === "delete")

  // 🧮 Account-wise transaction counts (only name + count)
  const accountTransactionSummary = user.Account.map(acc => ({
    accountName: acc.name,
    transactionCount: acc.transactions.length
  }));

  return {
    success: true,
    message: "User info loaded successfully",
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      accountTransactionSummary, // 👈 clean summary
      Transaction: user.Transaction,
      TransactionSnapshot: user.TransactionSnapshot,
      _counts: {
        accounts: accountCount,
        transactions: transactionCount,
        transactionsInuse: inuseTransactions.length,
        transactionsDeleted: deleteTransactions.length,
        snapshots: snapshotCount,
      }
    }
  };
};



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
export const update = async (
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
) => {
    console.log(accountId, "from accountRepository");

    return await prisma.account.update({
        where: {
            id: Number(accountId)
        },
        data: {
            name,
            address,
            custRelnNo,
            accountNo,
            startDate: startDate ? new Date(startDate) : null,
            endDate: endDate ? new Date(endDate) : null,
            currency,
            branch,
            ifsc,
            micr
        }
    });
};

// Check account

export const checkAccount = async (accountId) => {
    return prisma.account.findUnique({
        where: { id: Number(accountId) }
    });
};

// delete account

export const deleteById = async (accountId) => {
    return prisma.account.delete({
        where: { id: Number(accountId) }
    });
};

