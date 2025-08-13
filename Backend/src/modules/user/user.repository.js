import prisma from "../prisma/prismaClient.js"

export const findByEmail = async (email) =>{
    
    return await prisma.user.findUnique({
        where:{
            email
        }
    })
}

export const create = async ({name,email,password}) =>{
    return await prisma.user.create({
        data:{
            name,email,password
        }
    })
}