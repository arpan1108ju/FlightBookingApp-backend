import express from "express";
import passport from "passport";

import '../../authentication/auth.js';
import { generateToken } from "../../utils/generateJwtToken.js";

import { signup,login, googleSuccess, googleFailure, logout, isLoggedIn, sendResponseGoogleUser, refreshAccessToken } from "../../controllers/authController/authController.js";

const router = express.Router();


// parent route - /api/v1/auth

// ********** normal email/password auth using jwt ****************

router.post('/signup',signup);
router.post('/login',login);

router.post('/refresh-token',refreshAccessToken);

// ********** google authentication with jwt ***************


router.get('/google',
    (req,res,next)=>{
        console.log("oauth starting...");
        next();
    },
    passport.authenticate('google',{ scope: [ 'email', 'profile' ] })
);

router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect : '/api/v1/auth/google/failure',
        session : false
    }),
    sendResponseGoogleUser
)

router.get('/google/success',isLoggedIn,googleSuccess);
router.get('/google/failure',googleFailure);


//**************** LOGOUT ********* */
router.get('/logout',logout);

export default router;