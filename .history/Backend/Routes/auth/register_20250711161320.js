export const register = (req,res)=>{
        const [email,password] =req.body
        console.log(email,password)
        res.send(email,password)
}