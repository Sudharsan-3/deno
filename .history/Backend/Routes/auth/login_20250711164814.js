export const login = (req,res)=>{
    if(!req.body){
        res.send({
            "message":`Enter both eamil and password`
        })
    }
    const {email,password} = req.body
    
    res.json({ "eamil" : email,
        "message":"successfully loged in",
       
    })
}