import jwt from "jsonwebtoken";

export const generateToken = (email)=>{
    const key = process.env.JWT_SECRET;
    const token = jwt.sign({id : email},key,{
        expiresIn : '10s'
    });
    return token;
}