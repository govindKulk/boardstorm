"use client"

import React, { useEffect } from 'react'
import ToolsBar from './ToolsBar'
import dynamic from 'next/dynamic';

import { useSession } from 'next-auth/react';
import { useBoardContext } from '@/contexts/BoardContext';

// @ts-ignore
const BoardCanvas = dynamic(() => import("./BoardCanvas"), {
    ssr: false,
});


function BoardScreen() {
    console.log("board screen")
    const {activeTool, setActiveTool} = useBoardContext();




    function handleKeys(e: React.KeyboardEvent<HTMLDivElement>) {
        console.log(e.key)
        if(activeTool !== "text"){
            switch(e.key){
                
                case "h":
                    setActiveTool('hand');
                    break;
                case "t":
                    setActiveTool('text');
                    break;
                case "v":
                    setActiveTool('select');
                    break;
                case "r":
                    setActiveTool('rectangle');
                    break;
                case "c":
                    setActiveTool('circle');
                    break;
                case "x":
                    setActiveTool('eraser');
                    break;
                case "p":
                    setActiveTool('pencil');
                    break;
            }
        }
    }

  return (
    <div tabIndex={0}  onKeyDown={handleKeys} onKeyDownCapture={handleKeys} className='overflow-hidden'>
    <ToolsBar/>
    <BoardCanvas/>  
    </div>
  )
}

export default BoardScreen