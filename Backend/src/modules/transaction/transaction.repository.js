import prisma from "../prisma/prismaClient.js"



// Get all and deleted transactions from db 

export const getAllTransactionInuse = async () => {
  return prisma.transaction.findMany({
    where: {
      type: {
        equals: "inuse",
        mode: 'insensitive'
      }
    },
    orderBy: {
      id: 'asc', // ascending order by id
    },
  })
}

// getAllTransactionDeleted

export const getAllTransactionDeleted = async () => {
  return prisma.transaction.findMany({
    where: {
      type: {
        equals: "delete",
        mode: "insensitive"
      }
    },
    orderBy: {
      id: 'asc', // ascending order by id
    },
  })
}

// delete multiple transaction
export const deleteMultipleTransaction = async (ids) => {

  const result = await prisma.transaction.updateMany({
    where: {
      id: {
        in: ids.map((id) => Number(id)),
      },
    },
    data: {
      type: "delete", // Mark as deleted instead of removing
    },
    orderBy: {
      id: 'asc', // ascending order by id
    },
  });
  return result
}

// Transaction restore

export const restore = async (id) => {
  return prisma.transaction.update({
    where: {
      id: Number(id)
    },
    data: {
      type: "inuse"
    },

  })
}

// delete all transaction

export const deleteAllTransacion = async () => {
  return prisma.transaction.deleteMany();
}

// transaction filter

export const filter = async () => {
  const data = await prisma.transaction.findMany({
    where: {
      type: "inuse",
    },
    include: {
      files: true,
    },
  });
  return data

}

// Import transactions files like CSV or Excel




export const findUserById = (id) => prisma.user.findUnique({ where: { id } });
export const findAccountById = (id) => prisma.account.findUnique({ where: { id } });

export const createTransactionsInBulk = (transactions) => {
  return prisma.$transaction(
    transactions.map(txn => prisma.transaction.create({ data: txn }))
  );
};



// get unique transactionId

export const uniqueTransactionById = async (id) => {
  return await prisma.transaction.findUnique({
    where: {
      id: Number(id)
    }
  })
}

// transaction attachment

export const saveFiles = async (filesData) => {
  const createPromises = filesData.map((data) =>
    prisma.transactionFile.create({ data })
  );
  return await Promise.all(createPromises);
};

