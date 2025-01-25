"use client"
import dynamic from 'next/dynamic';
import React from 'react'

// @ts-ignore
const KonvaComponent = dynamic(() => import("@/components/freeDrawing"), {
    ssr: false,
});



function PracticePage() {
  return (
    <div>
        <KonvaComponent></KonvaComponent>
    </div>
  )
}

export default PracticePage