'use server'

import { prisma } from "@/prisma"
import { error } from "console"

async function getBoards(userId: string | undefined)  {
    
    if(!userId){
        return {
            data: null,
            error: "Invalid user id"
        }
    }
    
    try{

        
        const boards = await prisma.board.findMany({
            where: {
                userId: userId
            }
        })
        return {
            data: boards,
            error: null
        }
    }catch(error){
        console.log("erorr while fetching boards : ", error);
        return {
            error: "error while fetching boards",
            data: null
        }
    }
}
async function deleteBoard(boardId: string)  {
    
    
    
    try{

        
        const board = await prisma.board.delete({
            where: {
                id: boardId
            }
        })
        return {
            data: board,
            error: null
        }
    }catch(error){
        console.log("erorr while fetching board : ", error);
        return {
            error: "error while fetching board",
            data: null
        }
    }
}
async function getSingleBoard(boardId: string | undefined) {
    if (!boardId) {
        throw new Error("Board ID is missing");
    }

    try {
        const board = await prisma.board.findUnique({
            where: { id: boardId },
        });

        if (!board) {
            throw new Error("Board not found");
        }

        console.log("board shapes is  : ", board.shapes);
        console.log("shapes type  is  : ", typeof board.shapes);

        let safeShapes;
        let safePosition;
        if(typeof board.shapes === 'object'){
            safeShapes = board.shapes;
        }else{
            safeShapes = JSON.parse(board.shapes as string);
        }
        if(typeof board.position === 'object'){
            safePosition = board.position;
        }else{
            safePosition = JSON.parse(board.position as string);
        }

        return {
            ...board,
            shapes:   safeShapes,
            position: safePosition,
        };
    } catch (error) {
        console.error("Error while fetching board:", error);
        throw new Error("Error while fetching board");
    }
}

export {
    getBoards,
    deleteBoard,
    getSingleBoard
}