"use client"

import React from 'react'
import ToolsBar from './ToolsBar'
import dynamic from 'next/dynamic';

// @ts-ignore
const BoardCanvas = dynamic(() => import("./BoardCanvas"), {
    ssr: false,
});


function BoardScreen() {
  return (
    <div>
    <ToolsBar/>
    <BoardCanvas/>  
    </div>
  )
}

export default BoardScreen