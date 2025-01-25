"use client"

import BoardScreen from '@/components/boardscreen/BoardScreen'
import { CanvasData } from '@/types/types'
import React, { createContext, Dispatch, SetStateAction, useContext, useState } from 'react'

export default function SingleBoardPage() {
  return (
    <div>
      <BoardContextProvider>
        <BoardScreen/>
      </BoardContextProvider>
    </div>
  )
}



interface BoardContextType {
  activeTool: string
  setActiveTool: Dispatch<SetStateAction<string>>
  canvasData: CanvasData,
  setCanvasData: Dispatch<SetStateAction<any>>
}

let defaultValues: BoardContextType = {
  activeTool: 'select',
  setActiveTool: () => {},
  canvasData: {
    rectangles: [],
    circles: [],
    texts: []
  },
  setCanvasData: () => {}
}
const boardContext  = createContext<BoardContextType>(defaultValues);

const BoardContextProvider = ({
  children
}: {
  children: React.ReactElement
}) => {

  const [activeTool, setActiveTool] = useState('select');
  const [canvasData, setCanvasData] = useState<CanvasData>(null);

  return (
    <boardContext.Provider value={{activeTool, setActiveTool, canvasData, setCanvasData}}>
      {children}
    </boardContext.Provider>
  )
}


export const useBoardContext = () =>useContext(boardContext);