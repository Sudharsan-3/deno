export const login = (req,res)=>{
    if(!req.body){
        res.send({
            "message":`Enter both eamil and password`
        })
    }
    const {email,password} = req.body
    if(!email || !password){
        res.send({
            "message":`Enter both eamil and password`
        })
    }
    res.send({
        "Email"
        "message":"successfully loged in"
    })
}