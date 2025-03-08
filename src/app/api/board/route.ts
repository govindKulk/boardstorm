
import { signIn } from "@/auth";
import { prisma } from "@/prisma";
import { saltAndHashPassword } from "@/utils/password";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {

    const body = await req.json();
    const {title, shapes, userId,position, scale} = body;
    if(!title || !shapes){
        return Response.json({
            msg: "Provie Title for the board"
        })
    }

    try{

        const board = await prisma.board.create({
            data: {
                title,
                shapes,
                userId: userId,
                position,
                scale
            }
        })
        
  
        return Response.json({
            board,
            msg: 'created board'
        })
    }catch(e){
        console.log(e);
        return Response.json({
            msg: "something went wrong with query"
        })
    }

}