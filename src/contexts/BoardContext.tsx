"use client"

import { SocketClass } from "@/app/socket";
import { CanvasData } from "@/types/types";
import { debounce } from "@/utils/debounce";
import { useSession } from "next-auth/react";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { storeBoardData } from "@/app/actions/db";
import toast from "react-hot-toast";
import { getSingleBoard } from "@/app/actions/boards";
import { Router } from "lucide-react";
import { PuffLoader } from "react-spinners";

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
  drawMode: string,
  canvasLoading: boolean,
  triggerDownload: boolean,
  setTriggerDownload: Dispatch<SetStateAction<boolean>>,
}

let defaultValues: BoardContextType = {
  activeTool: 'select',
  setActiveTool: () => { },
  canvasData: {
    shapes: []
  },
  canvasLoading: true,
  setCanvasData: () => { },
  setSocketRef: () => { },
  setRoomId: () => { },
  color: '#475569',
  setColor: () => { },
  strokeWidth: 3,
  setStrokeWidth: () => { },
  drawMode: 'stroke',
  setDrawMode: () => { },
  triggerDownload: false,
  setTriggerDownload: () => { }
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
  const [canvasLoading, setCanvasLoading] = useState(true);
  const params = useSearchParams()
  const path = usePathname();
  const [isDemoPage, setIsDemoPage] = useState(path.split('/')[2] === "demo")
  const [triggerDownload, setTriggerDownload] = useState(false);

  const socketRef = useRef<Socket | null>(null)
  const [roomId, setRoomId] = useState(params.get("room") || "");
  console.log("room id : ", roomId);
  function setSocketRef(socket: Socket) {
    socketRef.current = socket;
  }

  const router = useRouter();

  
  useEffect(() => {
    function onConnect() {
        console.log("Connected..");
        setIsConnected(true);
    }

    function onDisconnect() {
        console.log("Disconnected..");
        setIsConnected(false);
    }

    const room = params.get("room");
    let socket: Socket | null = null;

    if (room) {

        setTimeout(() => {
            setCanvasLoading(false);
        }, 2000);

        socket = SocketClass.getInstance();
        setSocketRef(socket);
        socket.connect();
        socket.emit("join-room", { roomid: room });

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        socket.on("error-while-room-joining", (data) => {
            console.log("Error while joining:", data);
            socket?.disconnect();
        });

        socket.on("joined-room", () => {
            console.log("Joined room");
        });

        socket.on("update-canvas", (data) => {
            if (data.user !== socket?.id) {
                console.log("Received canvas update from:", data.user);
                setCanvasData(data.updatedCanvas);
            }
        });

        socket.on("room-closed", () => {
            const check = confirm("Admin has left the room. Do you want to continue working on the board?");
            if (check && boardId) {
                setLocalData(canvasData);
                router.push("/boards/" + boardId);
            } else {
                router.push("/");
            }
        });
    } else {
        if (id) {
            setBoardId(id as string);
        }

        if(isDemoPage){
          setCanvasLoading(false);
          const lsBoardData = JSON.parse(localStorage.getItem(`board-demo`) || "null");
          if(lsBoardData && lsBoardData.shapes && lsBoardData.shapes.length > 0){
            setCanvasData(lsBoardData);
          }
          return;
        }

        (async () => {
          const lsBoardData = JSON.parse(localStorage.getItem(`board-${boardId}`) || "null");
            try {
                const dbBoardData = await getSingleBoard(boardId);
                if (!isConnected && dbBoardData) {
                    console.log("Fetched board from database");
                    const { shapes, position, scale } = dbBoardData;

                    if (lsBoardData && lsBoardData.shapes.length > shapes.length) {
                        setCanvasData(lsBoardData);
                        setCanvasLoading(false);
                        return;
                    }

                    setCanvasData({ shapes, position, scale } as CanvasData);
                    setCanvasLoading(false);
                }
            } catch (e) {
                console.error(e);
                if (!isConnected) {
                    localStorage.removeItem(`board-${boardId}`);
                    toast.error("Error fetching your board.");
                    router.push("/boards");
                }
            }
        })();
    }

    return () => {
        console.log("Cleaning up...");
        if (socket) {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("error-while-room-joining");
            socket.off("joined-room");
            socket.off("update-canvas");
            socket.off("room-closed");
            socket.disconnect(); // Ensure socket disconnects properly
        }

        setDataBaseData(canvasData);
    };
}, [boardId]);


  function setLocalData(canvasData: CanvasData) {
    console.log("called set local data")
    if (boardId || isDemoPage) {
      localStorage.setItem(`board-${boardId || 'demo'}`, JSON.stringify(canvasData
      ));
      toast.success("Locally Saved Data", {
        position: "bottom-left"
      });
    }
  }

  async function setDataBaseData(canvasData: CanvasData) {

    if (userId && !isDemoPage) {
      console.log("called set db data")

      const { error, data: storedData } = await storeBoardData({
        data: canvasData,
        userId,
        boardId
      });
      if (error) {
        console.log(error);
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
      activeTool, setActiveTool, setSocketRef, canvasLoading,triggerDownload,setTriggerDownload, setRoomId, canvasData, color, setColor, strokeWidth, setStrokeWidth, drawMode, setDrawMode, setCanvasData: (canvasParamsData: CanvasData, isFromSockets = false) => {
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
