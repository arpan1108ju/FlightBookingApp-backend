import expressAsyncHandler from "express-async-handler";
import passport from "passport";
import { createUser, findUserByEmail } from "../userController.js/userController.js";
import { generateToken } from "../../utils/generateJwtToken.js";
import bcrypt from 'bcryptjs';

export const signup = expressAsyncHandler(async(req,res)=>{
    
    const user = req.body;
    if(!user.username || !user.email || !user.password){
        res.status(400);
        throw new Error("Incomplete information provided");
    }


    // TODO validate email

    const userExists = await findUserByEmail(user.email);
    if(userExists){ 
        console.log(userExists);
        res.status(400);
        throw new Error("Email already exists, please login");
    }

    // if already created account via google then checking via email 
    // will be already done in upper method
    // so directly create an user

    const newUser = await createUser(user);
     
    if(!newUser){
        res.status(500);
        throw new Error("Error in creating user in db");
    }

    console.log("generating token in signup...");
    const token = generateToken(newUser.email);

    const responseUserObj = {
        username : newUser.username,
        email : newUser.email,
        token : token,
        login_type : 'signup' 
    }

    res.send(responseUserObj);
})

export const login =  expressAsyncHandler(async(req,res)=>{
    const user = req.body;

    // TODO validate email

    const userExists = await findUserByEmail(user.email);

    if(!user.email || !user.password){
        res.status(400);
        throw new Error("Incomplete information provided");
    }
    
    if(!userExists){
        res.status(400);
        throw new Error("Email does not exists, please signup");
    }
    else if(userExists.googleId){
        res.status(400);
        throw new Error("Please authenticate through google");
    }
    else if(!(await bcrypt.compare(user.password,userExists.password))){
        res.status(400);
        throw new Error("Incorrect password");
    }

    console.log("generating token in login...");
    const token = generateToken(userExists.email);


    const responseUserObj = {
        username : userExists.username,
        email : userExists.email,
        token : token,
        login_type : 'login' 
    }

    res.send(responseUserObj);
       
})


export const googleSuccess = (req,res) => {
    // console.log("User : ",req.user);
    res.status(200).send({message : 'Successful google authentication'});
}

export const googleFailure = (req,res) => {
    res.status(500).send({message : 'Google authentication failed'});
}

export const isLoggedIn = (req,res,next) => {
    // console.log("User : ",req.user);
    req.user ? next() : res.status(401).send({message : "Not authorized"});
}

export const logout = (req,res) => {
    req.logout( (err)=> {
        if(err) throw new Error("Error during logout");
        // req.session.destroy();
        console.log("Destroying session,logging out...");
        res.send({message : "Logout successfully"});
    });
}

export const authenticated = passport.authenticate('jwt', { session: false });

export const sendResponseGoogleUser = async (req,res)=>{
    console.log("generating token in google...");
    const token = generateToken(req.user.email);

    const responseUserObj = {
        username : req.user.username,
        email : req.user.email,
        token : token,
        login_type : 'google' 
    }

    res.send(responseUserObj);
    // res.redirect('/api/v1/auth/google/success');
}