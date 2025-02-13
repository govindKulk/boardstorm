import { signIn } from "@/auth";
import { prisma } from "@/prisma";
import { saltAndHashPassword } from "@/utils/password";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {

    const body = await req.json();
    const {email, password} = body;
    if(!email || !password){
        return Response.json({
            msg: "Provie email and msg"
        })
    }

    try{

        const hashedPassword = await saltAndHashPassword(password);
        const user = await prisma.user.create({
            data: {
                email,
                hashedPassword
            }
        })
        
        await signIn("credentials", {
            email,
            password
        });
        Response.json({
            user,
            msg: 'registered sccess'
        })
    }catch(e){
        console.log(e);
        return Response.json({
            msg: "something went wrong with query"
        })
    }

}