"use client"
import React, { ContextType, useEffect, useRef, useState } from 'react'

type point = {
    x: number,
    y: number
}
function CanvasPage() {


    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
    const [startingPoint, setStartingPoint] = useState<point | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [startedDrawing, setStartedDrawing] = useState(false);
    useEffect(() => {

        if (canvasRef?.current) {
            const ctx = canvasRef.current?.getContext('2d');
            setContext(ctx);
            canvasRef.current.width = 700;
            canvasRef.current.height = 500;

        }
    }, [])
    
    
    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        const {offsetX, offsetY, clientX, clientY} = e.nativeEvent;
        setStartingPoint({
            x: offsetX,
            y: offsetY
        })
        if(context){
            context.beginPath()
            context.moveTo(offsetX,offsetY)

        }
    }

    const draw = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        if(!context || !isDrawing){
            return;
        }
        const {offsetX, offsetY} = e.nativeEvent;

        if(startingPoint){
            
            
            context.strokeStyle = "red"
            context.lineWidth = 3
            context.lineTo(offsetX, offsetY);
            context.stroke();

            


            
            
        }
        
        
    }
    const endDrawing = () => {
        if(!context){
            return;
        }

        setIsDrawing(false);
   
        setStartedDrawing(false);
        context.closePath();

    }
    return (
        <div
        className='min-h-screen flex items-center justify-center'
        >
            <canvas
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={endDrawing}
                onMouseOut={endDrawing}
                ref={canvasRef}
                className='border border-black rounded-lg shadow-md'
            />
        </div>
    )
}

export default CanvasPage