import prisma from "../prisma/prismaClient.js"

// update transaction

export const updateTransactionById = async (id, data) => {
  // Build updateData with only provided fields
  const updateData = {};

  if (data.transactionDate !== undefined) updateData.transactionDate = data.transactionDate;
  if (data.valueDate !== undefined) updateData.valueDate = data.valueDate;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.chequeOrRef !== undefined) updateData.chequeOrRef = data.chequeOrRef;
  if (data.amount !== undefined) updateData.amount = Number(data.amount);
  if (data.amountType !== undefined) updateData.amountType = data.amountType;
  if (data.balance !== undefined) updateData.balance = Number(data.balance);
  if (data.balanceType !== undefined) updateData.balanceType = data.balanceType;
  if (data.changeReason !== undefined) updateData.changeReason = data.changeReason;
  if (data.invoice !== undefined) updateData.invoice = data.invoice;

  // Now update only with fields that exist in updateData
  return prisma.transaction.update({
    where: { id: Number(id) },
    data: updateData
  });
};


export const createTransactionSnapshot = async (transaction, createdById, reason) => {
  return prisma.transactionSnapshot.create({
    data: {
      transactionId: transaction.id,
      slNo: transaction.slNo,
      transactionDate: transaction.transactionDate,
      valueDate: transaction.valueDate,
      description: transaction.description,
      chequeOrRef: transaction.chequeOrRef,
      amount: Number(transaction.amount),
      amountType: transaction.amountType,
      balance: transaction.balance,
      balanceType: transaction.balanceType,
      type: transaction.type,
      changedById: Number(createdById),
      changeReason: reason || null,
      invoice : transaction.invoice
    }
  });
};



// Get all transactions from db 

export const getAllTransactionInuse = async (id) => {
  return prisma.transaction.findMany({
    where: {
      createdById:Number(id),
      type: {
        equals: "inuse",
        mode: 'insensitive'
      }
    },
    include: {
      files: true,
    },
    orderBy: {
      id: 'asc', // ascending order by id
    },
  })
}

// getAllTransactionDeleted

export const getAllTransactionDeleted = async (id) => {
  return prisma.transaction.findMany({
    where: {
      createdById : Number(id),
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
    // orderBy: {
    //   id: 'asc', // ascending order by id
    // },
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

// Get transaction snapshot data

export const getTransactionSnapshot = async(transactionId)=>{
  return await prisma.transactionSnapshot.findMany({
    where :{ transactionId:Number(transactionId)}
  })
  
}

// Check attachment

export const checkAttachment = async (id) => {
  return await prisma.transactionFile.findUnique({
    where: {
      id: Number(id),
    },
  });
};

export const deleteAttachments = async (id) => {
  return await prisma.transactionFile.delete({
    where: { id: Number(id) },
  });
};


