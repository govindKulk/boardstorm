"use client"

import { SocketClass } from "@/app/socket";
import { CanvasData } from "@/types/types";
import { debounce } from "@/utils/debounce";
import { useSession } from "next-auth/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { storeBoardData } from "@/app/actions/db";
import toast from "react-hot-toast";
import { getSingleBoard } from "@/app/actions/boards";
import { Router } from "lucide-react";

interface BoardContextType {
  activeTool: string
  setActiveTool: Dispatch<SetStateAction<string>>
  canvasData: CanvasData,
  setCanvasData: (canvasData: CanvasData, isFromSockets?: boolean) => void,
  setSocketRef: (socket: Socket) => void,
  setRoomId: Dispatch<SetStateAction<string>>,
  color: string,
  setColor: Dispatch<SetStateAction<string>>,
  setStrokeWidth: Dispatch<SetStateAction<number>>,
  strokeWidth: number,
  setDrawMode: Dispatch<SetStateAction<string>>,
  drawMode: string
}

let defaultValues: BoardContextType = {
  activeTool: 'select',
  setActiveTool: () => { },
  canvasData: {
    shapes: []
  },
  setCanvasData: () => { },
  setSocketRef: () => { },
  setRoomId: () => { },
  color: '#475569',
  setColor: () => { },
  strokeWidth: 3,
  setStrokeWidth: () => { },
  drawMode: 'stroke',
  setDrawMode: () => { }
}
const boardContext = createContext<BoardContextType>(defaultValues);

export const BoardContextProvider = ({
  children
}: {
  children: React.ReactElement
}) => {

  const [activeTool, setActiveTool] = useState('select');
  const [canvasData, setCanvasData] = useState<CanvasData>(null);
  const [color, setColor] = useState('#475569');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [drawMode, setDrawMode] = useState('stroke');




  const { userId } = useAuth();


  const { id } = useParams();
  const session = useSession()
  const [boardId, setBoardId] = useState<string | undefined>(id as string);
  console.log("session : ", session);

  const [isConnected, setIsConnected] = useState(false);
  const params = useSearchParams()


  const socketRef = useRef<Socket | null>(null)
  const [roomId, setRoomId] = useState(params.get("room") || "");
  console.log("room id : ", roomId);
  function setSocketRef(socket: Socket) {
    socketRef.current = socket;
  }

  const router = useRouter();
  useEffect(() => {

    function onConnect() {
      console.log("connected..");
      setIsConnected(true);


    }

    function onDisconnect() {
      console.log("disconnected..")

      setIsConnected(false);
    }

    const room = params.get("room")

    let socket: Socket;

    if (room) {
      socket = SocketClass.getInstance();
      setSocketRef(socket);
      socket?.connect();
      socket?.emit("join-room", { roomid: room });

      socket.on('error-while-room-joining', (data) => {
        console.log("error while joining : ", data);
        socket.disconnect();
      })

      socket.on('joined-room', () => {
        console.log('joined room')
      })

      socket.on("update-canvas", (data) => {
        if (data.user !== socket.id) {
          console.log(data)
          setCanvasData(data.updatedCanvas);
          console.log("got data from user >> ", data.user);
        }
      })

      socket.on("room-closed", () => {
        const check = confirm("Admin has left the room. Do you want to continue working on the board ?");
        if(check && boardId){
          setLocalData(canvasData);
          router.push('/boards/' + boardId);
        }else{
          router.push('/');
        }
      })
    } else {

      if (id) {
        setBoardId(id as string);
      }

      (async () => {
        const { error: dbBoardError, data: dbBoardData } = await getSingleBoard(boardId);
        const boardData = JSON.parse(localStorage.getItem(`board-${boardId}`) || 'null');
        console.log("board data is", boardData)
        if (dbBoardError) {
          console.log(boardData);
          if (boardData && !isConnected) {
            console.log('ls data fetch')
            setCanvasData(boardData);
          }
        }else{
          if(!isConnected && dbBoardData){
            console.log('db data fetch')
            const {shapes, position, scale } = dbBoardData;

            if(boardData && boardData.shapes && boardData.shapes.length > shapes.length){
              setCanvasData(boardData);
              return;
            }
            setCanvasData({
              shapes,
              position,
              scale
            } as CanvasData);


          }
        }
      })()








    }

    () => {
      if (socket) {

        socket?.off('connect', onConnect);
        socket?.off('disconnect', onDisconnect);



      }

      setDataBaseData(canvasData);
      setLocalData(canvasData);

    }

    
    
  }, [boardId])
  
  function setLocalData(canvasData: CanvasData) {
    console.log("called set local data")
    if (boardId) {
      localStorage.setItem(`board-${boardId}`, JSON.stringify(canvasData
      ));
      toast.success("Locally Saved Data", {
        position: "bottom-left"
      });
    }
  }

  async function setDataBaseData(canvasData: CanvasData) {
    
    if (userId) {
      console.log("called set db data")

      const { error, data: storedData } = await storeBoardData({
        data: canvasData,
        userId,
        boardId
      });
      if (error) {
        toast.error("Unable to store board inside database! Try again later");

      } else {
        toast.success("Auto Saved Data");
      }
    }

  }

  const debounceSetLocalData = useMemo(
    () => debounce((canvasData) => setLocalData(canvasData), 5000),
    [boardId]
  );

  const debounceStoreDbData = useMemo(() => debounce(async (data: CanvasData) => setDataBaseData(data), 15000), [boardId, userId]);


  return (
    <boardContext.Provider value={{
      activeTool, setActiveTool, setSocketRef, setRoomId, canvasData, color, setColor, strokeWidth, setStrokeWidth, drawMode, setDrawMode, setCanvasData: (canvasParamsData: CanvasData, isFromSockets = false) => {
        debounceSetLocalData(canvasParamsData);
        debounceStoreDbData(canvasParamsData);
        //   let ids = canvasData?.shapes.map(shape => shape.id);
        //   let diffShapes = canvasParamsData?.shapes.filter(shape => {
        //     if(shape.type === "pencil"){
        //         console.log("points : ", shape.points);
        //     }
        //     if(!ids?.includes(shape.id)){
        //         return shape;
        //     }else{
        //         return false;
        //     }
        //   })

        //   console.log("difs : ", diffShapes);

        if (!isFromSockets) {
          socketRef?.current?.emit("share-canvas", JSON.stringify({
            canvasData: canvasParamsData,
            roomId
          }))
        }
        // debounceStoreDbData(canvasData)
        return setCanvasData(canvasParamsData);
      }
    }} >

      {children}
    </boardContext.Provider>
  )
}


export const useBoardContext = () => useContext(boardContext);
