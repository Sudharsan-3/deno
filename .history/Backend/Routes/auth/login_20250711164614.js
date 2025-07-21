export const login = (req,res)=>{
    if()
    const {email,password} = req.body
    if(!email || !password){
        res.send({
            "message":`Enter both eamil and password`
        })
    }
    res.send({
        "message":"successfully loged in"
    })
}