import { PrismaClient } from "@prisma/client"

export const readAccountD = async(req,res)=>{
    const prisma = new PrismaClient()
    try {
        const resp = await prisma.account.findMany()
         res.send(resp)
    } catch (error) {
        
        
    }
   
}