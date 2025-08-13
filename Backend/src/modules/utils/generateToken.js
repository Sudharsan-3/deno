import jwt from "jsonwebtoken"

const generateToken = async (user)=>{
    const secret = process.env.SECRETTOKEN
    const {id,name,email}= user
   
    const token = jwt.sign({id,name,email},secret,{
        expiresIn : '2d',
    })
    return ({
        user : {
            id:id,
            name:name,
            email:email
        },
        token:token

    })
}

export default generateToken;