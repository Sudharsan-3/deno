export const register = (req,res)=>{
    const {email,password} = req.body
    
    res.json({"email":email,
        "message":"successfully register"
    })
}