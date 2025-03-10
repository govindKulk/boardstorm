"use client"

import React, { useEffect } from 'react'
import ToolsBar from './ToolsBar'
import dynamic from 'next/dynamic';

import { useSession } from 'next-auth/react';
import { useBoardContext } from '@/contexts/BoardContext';
import { PuffLoader } from 'react-spinners';

// @ts-ignore
const BoardCanvas = dynamic(() => import("./BoardCanvas"), {
    ssr: false,
});


function BoardScreen() {
    console.log("board screen")
    const { activeTool, setActiveTool, canvasLoading } = useBoardContext();

    if (canvasLoading) {
        return (<div className="bg-muted/50  fixed inset-0 h-screen w-screen z-[1000] flex items-center justify-center">
            <PuffLoader size={100} />
        </div>)
    }



    function handleKeys(e: React.KeyboardEvent<HTMLDivElement>) {
        console.log(e.key)
        if (activeTool !== "text") {
            switch (e.key) {

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
        <div tabIndex={0} onKeyDown={handleKeys} onKeyDownCapture={handleKeys} className='overflow-hidden'>
            <ToolsBar />
            <BoardCanvas />
        </div>
    )
}

export default BoardScreen