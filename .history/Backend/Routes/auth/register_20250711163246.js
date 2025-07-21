export const register = (req,res)=>{
    const {[email,password} = req.body
    
    res.send("hi",email)
}