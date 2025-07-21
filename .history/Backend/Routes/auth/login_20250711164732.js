export const login = (req,res)=>{
    if(!req.body){
        res.send({
            "message":`Enter both eamil and password`
        })
    }
    const {email,password} = req.body
    
    res.json({
        "message":"successfully loged in",
        "eamil" : email,
    })
}