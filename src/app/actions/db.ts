"use server"

import { prisma } from "@/prisma";
import { CanvasData } from "@/types/types"

export const storeBoardData = async ({data, userId, boardId} : {data: CanvasData, userId: string, boardId: string | undefined}) => {

    if(!data || !boardId){
        return {
            data: null,
            error: "Something went wrong. Either data or boardid is missing"
        };
    }

    try{
        const {shapes, position, scale} = data;
        const newBoard = await prisma.board.update({
            where: {
                userId,
                id: boardId
            },
            data: {
                userId: userId,
                shapes: JSON.stringify(shapes),
                position: JSON.stringify(position || {
                    x:0, y:0
                }),
                scale: scale ? Number(scale) : 1.0
            }
        })
    
        return {
            data: newBoard,
            error: null
        };

    }catch(error){

        console.log("Error occured while storing board data -> ", error);
        return {
            data: null,
            error: "Error occured while storing board data"
        };
    }


}

export const getBoardData = async (
    boardId: string,

) => {

    console.log("hello ");
    return;

}