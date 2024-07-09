import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import { Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt';
import expressAsyncHandler from 'express-async-handler';
import { findUserByEmail, userExistsOrCreateGoogle } from '../controllers/userController.js/userController.js';

// Local Strategy



// JWT strategy
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET
  }, async (jwt_payload, done) => {
    try {
      console.log("inside jwt strategy");
      console.log(jwt_payload);
      const user = await findUserByEmail(jwt_payload.id);
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));


// Google strategy
passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  process.env.BACKEND_BASE_URL + "/api/v1/auth/google/callback",
    passReqToCallback   : true
  },
   async function(request, accessToken, refreshToken, profile, done) {  
    var res = request.res;
    try {
      console.log("inside google strategy");
      const user = await userExistsOrCreateGoogle(profile);
      done(null,user);
    } 
    catch (error) {
       res.status(error.code);
       done(error);
    }
  }
));


// ********** only when session is being used ***********//

/*
serializeUser determines which data of the user object
should be stored in the session. The result of the serializeUser
method is attached to the session as req.session.passport.user = {}.
Here for instance, it would be (as we provide the user id as the key)
req.session.passport.user = {id: 'xyz'}
*/

passport.serializeUser(function (user,done) {
    console.log("Serializing...")
    done(null,user.email);
})


/*
The first argument of deserializeUser corresponds to the key 
of the user object that was given to the done function
. So your whole object is retrieved with help of that key.
 That key here is the user id (key can be any key of the 
 user object i.e. name,email etc). In deserializeUser 
 that key is matched with the in memory array / database or any data resource.
The fetched object is attached to the request object as req.user
*/
passport.deserializeUser(async function (email,done){
    console.log("Deserializing...")
    const user = await findUserByEmail(email);
    if(!user){
        done(new Error("User with given email does not exists."));
    }
    else {
        done(null,user);
    }
})