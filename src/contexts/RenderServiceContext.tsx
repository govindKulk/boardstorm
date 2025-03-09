"use client"
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";


interface IRenderServiceContext {
    isLive: boolean;
    getStatus: () => boolean,
    setShowToast: Dispatch<SetStateAction<boolean>>
}


const RenderServiceContext = createContext<IRenderServiceContext>({
    isLive: false,
    getStatus: () => false,
    setShowToast: () => { }
});

export default function RenderServiceProvider({
    children
}: {
    children: React.ReactNode
}) {

    const [isLive, setIsLive] = useState(false);
    const [showToast, setShowToast] = useState(false);
    let id: NodeJS.Timeout;


    useEffect(() => {
        console.log("render service effect")
        async function sendRequest() {
            try {
                const res = await fetch("https://boardstorm-sockets.onrender.com/rooms", {
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        
                    },
                    mode: 'cors',
                    method: "GET"
                });

                if (res.ok) {
                    setIsLive(true);
                    clearInterval(id);
                    if (true) {
                        console.log("render is on");
                        toast.success("Render started, enjoy!", {
                            duration: 2000,
                            position: "bottom-right"
                        })

                    }
                } 
            }catch(e){
                console.log(e);
                console.log("render is off");
                toast.error("Render is starting, wait!", {
                    duration: 2000,
                    position: "bottom-right"
                })
            
            }
            
        }

        id = setInterval(() => {
            sendRequest()
        }, 15000)

        return () => {
            clearInterval(id);
        }

    }, [])


    return (
        <RenderServiceContext.Provider value={{ getStatus: () => isLive, isLive, setShowToast }}>
            {
                children
            }
        </RenderServiceContext.Provider>
    )
}

export const useRenderServiceStatus = () => useContext(RenderServiceContext);