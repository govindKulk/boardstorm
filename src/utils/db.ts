import { prisma } from "@/prisma"
import { comparePassAndHash, saltAndHashPassword } from "./password";
import { User } from "@prisma/client";



async function getUserFromDb(email : string, password : string) {
    let emailExists = false;
    let passwordsMatched = false;
    let user : User | null = null;

    user = await prisma.user.findUnique({
        where: {
            email,
        }
    })

    if (user){
        emailExists = true;
        passwordsMatched = await comparePassAndHash(password, user.hashedPassword);
        
        if(!passwordsMatched){
            return {
                user: null, // null
                emailExists, // true
                passwordsMatched // false
            }
        }
        return {
            user, // user
            emailExists, // true
            passwordsMatched // true
        }
    }

    // register the user
    user = await createUser(email, password);


    return {
        user, // user
        emailExists, // false
        passwordsMatched // false
    }


}


async function createUser(email: string, password: string){
    
    let user = null;
    try{
        let hash = await saltAndHashPassword(password);
        user = await prisma.user.create({
            data: {
                email,
                hashedPassword: hash
            }
        });

        return user //user
        
    }catch(e){

        console.log(e);
        return user // null
    }
    
    
}

export {
    getUserFromDb
}