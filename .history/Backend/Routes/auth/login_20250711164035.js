export const login = (req,res)=>{
    const {email,password} = req.body
    if(email && password){
        res.s
    }
    res.send({
        "message":"successfully loged in"
    })
}