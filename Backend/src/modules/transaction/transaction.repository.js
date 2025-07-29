import prisma from "../prisma/prismaClient.js"



// Get all and deleted transactions from db 

export const getAllTransactionInuse = async()=>{
    return prisma.transaction.findMany({
      where :{
        type : {
          equals : "inuse",
          mode : 'insensitive'
        }
      },
      orderBy: {
        id: 'asc', // ascending order by id
      },
    })
}

export const getAllTransactionDeleted = async()=>{
  return prisma.transaction.findMany({
    where :{
      type : {
        equals : "delete",
        mode : "insensitive"
      }
    },
    orderBy: {
      id: 'asc', // ascending order by id
    },
  })
}

// delete multiple transaction
export const deleteMultipleTransaction = async(ids)=>{
    
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

export const restore = async (id) =>{
    return prisma.transaction.update({
        where :{
            id :Number(id)
        },
        data :{
            type : "inuse"
        },
        orderBy: {
          id: 'asc', // ascending order by id
        },
    })
}

// delete all transaction

export const deleteAllTransacion = async()=>{
    return prisma.transaction.delete();
}

// transaction filter

export const filter = async() =>{
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
