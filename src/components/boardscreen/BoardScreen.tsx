"use client"

import React, { useEffect } from 'react'
import ToolsBar from './ToolsBar'
import dynamic from 'next/dynamic';
import { useBoardContext } from '@/app/board/[id]/page';
import { useSession } from 'next-auth/react';

// @ts-ignore
const BoardCanvas = dynamic(() => import("./BoardCanvas"), {
    ssr: false,
});


function BoardScreen() {
    console.log("board screen")
    const {activeTool, setActiveTool} = useBoardContext();

    const {data} = useSession();
    useEffect(() => {
        console.log("session from boardcanvas >> " , data)
    }, [])
    console.log("session from boardcanvas >> " , data)

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
            }
        }
    }

  return (
    <div tabIndex={0}  onKeyDown={handleKeys} onKeyDownCapture={handleKeys} className='overflow-y-hidden'>
    <ToolsBar/>
    <BoardCanvas/>  
    </div>
  )
}

export default BoardScreen