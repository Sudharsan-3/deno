export const login = (req,res)=>{
    const {email,password} = req.body
    if(email && password){
        res.send({
            "message":`Enter both `
        })
    }
    res.send({
        "message":"successfully loged in"
    })
}