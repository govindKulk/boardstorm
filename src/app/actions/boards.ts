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
async function getSingleBoard(boardId: string | undefined)  {


    if(!boardId){
        return {
            error: "Boardid is missing",
            data: null
        }
    }
    
    
    try{

        
        const board = await prisma.board.findUnique({
            where: {
                id: boardId
            }
        })

        if(!board) {
            return {
                error: "Board not found",
                data: null
            }
        }
        return {
            data: {
                ...board,
                shapes: JSON.parse(board.shapes as string),
                position: JSON.parse(board.position as string)
            },
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

export {
    getBoards,
    deleteBoard,
    getSingleBoard
}