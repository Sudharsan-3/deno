import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyToken = (req, res, next) => {
    const secretKey = process.env.SECRETTOKEN
    const token = req.headers['authorization']; 
    console.log(token,"from headers")
  
    if (!token) {
      return res.status(401).json({ error: "Token missing" });
    }
  
    try {
      const verified = jwt.verify(token, secretKey);
      // console.log(verified,"verification verified")
      
      req.result = verified;
      console.log(req.result,"verification")
      next();
    } catch (error) {
      console.error("Token verification failed:", error.message);
      return res.status(403).json({ error: "Invalid token" });
    }
  };