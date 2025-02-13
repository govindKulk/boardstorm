"use client"

import BoardScreen from '@/components/boardscreen/BoardScreen'
import { CanvasData } from '@/types/types'
import { debounce } from '@/utils/debounce'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import React, { createContext, Dispatch, SetStateAction, useContext, useEffect, useMemo, useState } from 'react'

export default function SingleBoardPage() {






  return (
    <div

    >
      <BoardContextProvider>
        <BoardScreen />
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
  setActiveTool: () => { },
  canvasData: {
    shapes: []
  },
  setCanvasData: () => { }
}
const boardContext = createContext<BoardContextType>(defaultValues);

const BoardContextProvider = ({
  children
}: {
  children: React.ReactElement
}) => {

  const [activeTool, setActiveTool] = useState('select');
  const [canvasData, setCanvasData] = useState<CanvasData>(null);


  const [boardId, setBoardId] = useState<string | null>(null);



  console.log(boardId);
  const { id } = useParams();
  const session = useSession()
  console.log("session : ", session);


  useEffect(() => {
    if (id) {
      setBoardId(id as string);
    }

    const boardData = JSON.parse(localStorage.getItem(`board-${boardId}`) || 'null');
    console.log(boardData);
    if (boardData) {
      setCanvasData(boardData);
    }



  }, [boardId])

  function setLocalData(canvasData: CanvasData) {
    console.log("called set local data")
    if(boardId){
      localStorage.setItem(`board-${boardId}`, JSON.stringify(canvasData
      ));
    }
  }

  const debounceSetLocalData = useMemo(
    () => debounce((canvasData) => setLocalData(canvasData), 5000),
    [boardId] // Empty dependency array ensures it stays the same across renders.
  );
  

  return (
    <boardContext.Provider value={{
      activeTool, setActiveTool, canvasData, setCanvasData: (canvasData: CanvasData) => {
        debounceSetLocalData(canvasData);
        return setCanvasData(canvasData);
      }
    }} >
      
      {children}
    </boardContext.Provider>
  )
}


export const useBoardContext = () => useContext(boardContext);