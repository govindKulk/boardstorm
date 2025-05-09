"use client"

import React, { useEffect } from 'react'
import ToolsBar from './ToolsBar'
import dynamic from 'next/dynamic';
import { useBoardContext } from '@/contexts/BoardContext';
import { PuffLoader } from 'react-spinners';
import { useRenderServiceStatus } from '@/contexts/RenderServiceContext';

// @ts-ignore
const BoardCanvas = dynamic(() => import("./BoardCanvas"), {
    ssr: false,
});


function BoardScreen() {
    console.log("board screen")
    const { activeTool, setActiveTool, canvasLoading } = useBoardContext();
    const {setShowToast, isLive, RenderStatusBadge} = useRenderServiceStatus();

    if (canvasLoading) {
        return (<div className="bg-muted/50 text-primary-foreground  fixed inset-0 h-screen w-screen z-[1000] flex items-center justify-center">
            <PuffLoader size={100} />
        </div>)
    }

    useEffect(() => {
        if(isLive){
            setShowToast(false);
        }
        setShowToast(true)
    }, [isLive])



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
            <div
            className='fixed bottom-4 right-1 z-10 '
            >
            <RenderStatusBadge/>

            </div>
            <BoardCanvas />
        </div>
    )
}

export default BoardScreen