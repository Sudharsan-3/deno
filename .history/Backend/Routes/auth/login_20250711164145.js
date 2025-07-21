export const login = (req,res)=>{
    const {email,password} = req.body
    if(email && password){
        res.send({
            "message"
        })
    }
    res.send({
        "message":"successfully loged in"
    })
}