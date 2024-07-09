import expressAsyncHandler from "express-async-handler";
import driver from '../../utils/neo4j-driver.js';
import parser from 'parse-neo4j';
import bcrypt from 'bcryptjs';

export const findUserByEmail = expressAsyncHandler(async(email)=>{
    const queryExists = `MATCH (user :User {email : $email})
     RETURN user`;
    const result = parser.parse(await driver.executeQuery(queryExists,{email : email}));
    if(result.length === 0){
        return null;
    }
    return result[0];
})


export const createUser = expressAsyncHandler(async (user)=>{

    const password = user.password;
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_COST,10));
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;

    const query = `
    CREATE (user:User 
      {
        username : $username,
        email : $email,
        password : $password
      }
    )
      RETURN user
    `;
    const result = parser.parse(await driver.executeQuery(query, user));
    if(result.length === 0){
       return null;
    }
    return result[0];
});


export const userExistsOrCreateGoogle = expressAsyncHandler(async(profile) => {
    const queryExists = `MATCH (user :User {googleId : $googleId} ) RETURN user`;
    const result = parser.parse(await driver.executeQuery(queryExists,{googleId : profile.id}));
    if(result.length === 0){

        // check for normal login
        const queryExists2 = `MATCH (user :User {email : $email} ) RETURN user`;
        const result2 = parser.parse(await driver.executeQuery(queryExists2,{email : profile.email}));

        if(result2.length !== 0){
          console.log("result exists via normal method..");
          const error = new Error("please login via normal method");
          error.code = 400;
          throw error;
        }

        console.log('Creating new user(oauth2)...');
        const queryCreate = `
        CREATE (user:User 
        {
         googleId :$googleId,
         email: $email,
         username : $username
         })
         RETURN user`;
         const resultCreate = parser.parse(await driver.executeQuery(queryCreate,
            {
             googleId : profile.id,
             email : profile.email,
             username : profile.displayName
            }));
        
         if(resultCreate.length === 0){
            const error = new Error("Error creating user(oauth2)");
            error.code = 500;
            throw error;
         }
         console.log("result created in google : ",resultCreate[0]);
         return resultCreate[0];   
    }
    console.log("result exists in google : ",result[0]);
    return result[0];   
})


export const updateUserRefreshToken = expressAsyncHandler(async(email,refreshToken)=>{
    const query = `MATCH (user:User {email : $email})
      SET user.refreshToken = $refreshToken
      RETURN user`
    ;

    const result = parser.parse(await driver.executeQuery(query,{
      email : email,
      refreshToken : refreshToken
    }));

    if(result.length === 0){
       const error = new Error("Error updating user refresh token");
       error.code = 500;
       throw error;
    }
    return result[0];
})