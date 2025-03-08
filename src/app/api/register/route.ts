import { signIn } from "@/auth";
import { prisma } from "@/prisma";
import { saltAndHashPassword } from "@/utils/password";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {

    const body = await req.json();
    const { email, password, name } = body;
    if (!email || !password || !name) {
        return NextResponse.json({
            msg: "Provie email and msg"
        }, {
            status: 400
        })
    }

    try {

        const hashedPassword = await saltAndHashPassword(password);

        const existingUser = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (existingUser) {
            return NextResponse.json({
                msg: "Email Already Exists", 
             
            }, {
                status: 400
            })
        }
        const user = await prisma.user.create({
            data: {
                email,
                name,
                hashedPassword
            }
        })
        await signIn("credentials", {
            email,
            password,
            redirect: false
        });
        return NextResponse.json({
            user,
            msg: 'registered sccessfull'
        })
    } catch (e) {
        console.log("Error is  : ", e);
        return NextResponse.json({
            msg: "something went wrong", 
         
        }, {
            status: 500
        })
    }

}