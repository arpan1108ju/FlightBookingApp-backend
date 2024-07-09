import jwt from "jsonwebtoken";
import { updateUserRefreshToken } from "../controllers/userController.js/userController.js";
import expressAsyncHandler from "express-async-handler";

export const generateRefreshToken = expressAsyncHandler( async(email)=>{
    const key = process.env.JWT_REFRESH_TOKEN_SECRET;
    const exp_time = process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME;
    const token = jwt.sign({id : email},key,{
        expiresIn : exp_time
    });

    await updateUserRefreshToken(email,token);

    return token;
})