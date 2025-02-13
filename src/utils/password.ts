import bcrypt from 'bcryptjs';

async function saltAndHashPassword(password: string){

    // const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, 10); // u can also use that salt here but this also works.
    return hashedPassword;
    
}

async function comparePassAndHash(password: string | null, hash: string  | null){

    if(!password || !hash){
        return false;
    }

    try{
        const compare = await bcrypt.compare(password, hash);
        return true;
    }catch(e){
        console.log(e);
        return false;
    }

}

export {
    saltAndHashPassword,
    comparePassAndHash
}