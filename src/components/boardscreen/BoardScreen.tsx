"use client"

import React, { useEffect, useState } from 'react'
import ToolsBar from './ToolsBar'
import dynamic from 'next/dynamic';
import { useBoardContext } from '@/contexts/BoardContext';
import { PuffLoader } from 'react-spinners';
import { useRenderServiceStatus } from '@/contexts/RenderServiceContext';
import GenAIFloater from '../chat/GenAiFloater';
import GenAIChatWindow from '../chat/GenAiChatWindow';

// @ts-ignore
const BoardCanvas = dynamic(() => import("./BoardCanvas"), {
    ssr: false,
});


function BoardScreen() {
    console.log("board screen")
    const { activeTool, setActiveTool, canvasLoading, setCanvasData, canvasData } = useBoardContext();
    const {setShowToast, isLive, RenderStatusBadge} = useRenderServiceStatus();
    const [isChatOpen, setIsChatOpen] = useState(false);

    
    useEffect(() => {
        if(isLive){
            setShowToast(false);
        }
        setShowToast(true)
    }, [isLive])
    
    if (canvasLoading) {
        return (<div className="bg-muted/50 text-primary-foreground  fixed inset-0 h-screen w-screen z-[1000] flex items-center justify-center">
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
            <div
            className='fixed bottom-4 right-1 z-10 '
            >
            <RenderStatusBadge/>

            </div>

            <div className='fixed top-8 right-4 z-20'>
                <GenAIFloater
                onClick={() => setIsChatOpen(true)}
                />
            </div>
            <GenAIChatWindow
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            onGenerate={(data: any) => setCanvasData(canvasData ? {
                ...canvasData,
                shapes: [...canvasData.shapes, ...data.shapes.map((s: any) => ({
                    ...s,
                    id: `${s.type}-id-${crypto.randomUUID()}`
                }))]
            } : {
                ...data,
                shapes: (data.shapes.map((s: any) => ({
                    ...s,
                    id: `${s.type}-id-${crypto.randomUUID}`
                })))
            }) }
            />
            <BoardCanvas />

        </div>
    )
}

export default BoardScreen