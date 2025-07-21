export const login = (req,res)=>{
    const {email,password} = req.body
    if(email ){
        res.send({
            "message":`Enter both eamil and password`
        })
    }
    res.send({
        "message":"successfully loged in"
    })
}