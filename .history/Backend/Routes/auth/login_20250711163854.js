export const login = (req,res)=>{
    const {email,password} = req.body
    res.send({
        "message":"successfully log"
    })
}