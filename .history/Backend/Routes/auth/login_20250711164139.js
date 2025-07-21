export const login = (req,res)=>{
    const {email,password} = req.body
    if(email && password){
        res.send({
            
        })
    }
    res.send({
        "message":"successfully loged in"
    })
}