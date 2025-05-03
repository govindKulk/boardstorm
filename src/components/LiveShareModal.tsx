"use client";
import React, { useEffect, useRef, useState } from "react";
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalTrigger,
} from "@/components/ui/animated-modal";
import { Button } from "./ui/button";
import { SocketClass } from "@/app/socket";
import { Socket } from "socket.io-client";
import { useParams, usePathname } from "next/navigation";
import { CopyCheck, CopyIcon, Share } from "lucide-react";
import { BsCloudSnowFill } from "react-icons/bs";
import { useBoardContext } from "@/contexts/BoardContext";
import Image from "next/image";
import { ClipLoader } from "react-spinners";
import { useRenderServiceStatus } from "@/contexts/RenderServiceContext";



export default function LiveShareModalButton() {

    const [socket, setSocket] = useState<Socket | undefined>(SocketClass.getInstance());
    const [isConnected, setIsConnected] = useState(socket?.connected || false);
    const [transport, setTransport] = useState("");
    const [roomIdState, setroomIdState] = useState<undefined | string>(undefined);
    const [copied, setCopied] = useState(false);
    const path = usePathname();
    const [isDemoPage, setIsDemoPage] = useState(path.split('/')[2] === "demo")
    const { canvasData, setSocketRef, setRoomId, setCanvasData } = useBoardContext()
    const canvasDataRef = useRef(canvasData);
    console.log(canvasData, " <*< canvasdata ")

    const [isLoading, setIsLoading] = useState(false);
    const { isLive } = useRenderServiceStatus();
    async function handleShareClick() {
        try {
            setIsLoading(true);

            socket?.connect();
            if (socket) {
                setSocketRef(socket);
            }
            socket?.emit("create-room");

            setTimeout(() => {
                setIsLoading(false);
            }, 2000)

        } catch (e) {
            setIsLoading(false);
            console.log(e)
        }
    }

    console.log("socket connection >> : ", socket?.connected)
    function handleStopShareClick() {
        try {
            socket?.disconnect();

        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        canvasDataRef.current = canvasData;
    }, [canvasData])

    useEffect(() => {


        function onConnect() {
            console.log("connected..");
            setIsConnected(true);

            socket?.io.engine.on("upgrade", (transport) => {
                setTransport(transport.name);
            });
        }

        function onDisconnect() {
            console.log("disconnected..")

            setIsConnected(false);
        }

        let roomId: string;
        socket?.on('connect', onConnect);
        socket?.on('disconnect', onDisconnect);
        socket?.on('room-created', (data) => {
            console.log("created-room : ", data.roomId);
            roomId = data.roomId;
            setroomIdState(data.roomId);
            setRoomId(roomId);
        })
        socket?.on("collaborator-joined", (data) => {
            console.log("collaborator has joined : ", data);
            console.log("room id state: ", roomId);
            console.log("canvas sending ", canvasDataRef.current)
            socket.emit('share-canvas', JSON.stringify({
                canvasData: canvasDataRef.current,
                roomId
            }));
        })
        socket?.on("update-canvas", (data) => {
            if (data.user !== socket.id) {
                console.log(data)
                setCanvasData(data.updatedCanvas, true);
                console.log("got data from user live share >> ", data.user);
            }
        })


        return () => {
            socket?.off('connect', onConnect);
            socket?.off('disconnect', onDisconnect);

        };
    }, []);



    const params = useParams();

    const linkRef = useRef<HTMLSpanElement | null>(null);

    const handleCopy = () => {

        typeof navigator !== undefined && navigator.clipboard.writeText(linkRef?.current?.textContent || "")
        setCopied(true)
        setTimeout(() => {
            setCopied(false);
        }, 3000)
    }


    return (
        <div className="  ">
            <Modal

            >
                <ModalTrigger className=" ">


                    <div className="flex gap-2 items-center w-full">
                        <span className="text-lg">
                            Live Share
                        </span>
                        <Share fontSize={40} width={100} />
                    </div>

                </ModalTrigger>

                <ModalBody
                    className="fixed z-50 max-w-md"
                >

                    <div
                        className="absolute h-full inset-0 -z-10 bg-muted"
                    >
                        <Image className="opacity-20" src="/share-image.png" width={500} height={500} alt="share icon" />
                    </div>
                    <ModalContent
                        className=""
                    >



                        <h3 className="text-xl sm:text-2xl font-bold">Share the board with friends.  </h3>
                        {isConnected && roomIdState && <div
                            className="bg-green-300/50 dark:bg-green-300/80 py-2 px-4 text-lg  my-auto text-green-700 font-bold rounded-md border-green-500 border-2 overflow-x-hidden"
                        >
                            Share this link with your friends:
                            <br />
                            <span
                                onClick={handleCopy}

                                ref={linkRef} className="text-sm break-keep border border-green-500 block rounded-xl p-2 text-green-900 hover:bg-green-300/60 transition cursor-pointer ">https://boardstorm.vercel.app/boards/{isDemoPage ? 'demo' : params.id}?room={roomIdState}</span>

                            {!copied ? <span className="flex items-center cursor-pointer text-slate-600 my-2 gap-2 text-sm transition-all">Copy: <CopyIcon
                                onClick={handleCopy}
                                size={20} /></span> : <span className="flex items-center cursor-pointer text-slate-600 my-2 gap-2 text-sm transition-all">Copied <CopyCheck size={20} /></span>}
                        </div>}


                    </ModalContent>

                    <ModalFooter
                        className="justify-center"
                    >
                        {!isConnected ? <Button
                            disabled={isLoading || !isLive}
                            className="
                    bg-green-600
                    text-white
                    disabled:bg-green-600/70
                    text-xl
                    "
                            onClick={handleShareClick}
                        >
                            {isLoading || !isLive ? <ClipLoader size={20} /> : "Share Now"}
                        </Button> : <Button

                            className="
                                        bg-red-600
                                        text-white
                                        text-xl
                                        "
                            onClick={handleStopShareClick}
                        >
                            Stop Sharing
                        </Button>}
                    </ModalFooter>

                </ModalBody>


            </Modal>
        </div>
    );
}