import jwt from "jsonwebtoken";

export const generateAccessToken = (email)=>{
    const key = process.env.JWT_ACCESS_TOKEN_SECRET;
    const exp_time = process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME;
    const token = jwt.sign({id : email},key,{
        expiresIn : exp_time
    });
    return token;
}