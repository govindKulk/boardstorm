"use client";

import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import {JSX} from "react";

interface IRenderServiceContext {
  isLive: boolean;
  getStatus: () => boolean;
  setShowToast: Dispatch<SetStateAction<boolean>>;
  RenderStatusBadge: () => JSX.Element;

}

const RenderServiceContext = createContext<IRenderServiceContext>({
  isLive: false,
  getStatus: () => false,
  setShowToast: () => {},
  RenderStatusBadge: () => <></>,
  
});

export default function RenderServiceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLive, setIsLive] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const RenderStatusBadge = () => {

  
    const statusColor = isLive ? 'bg-green-600' : 'bg-red-600/30'
    const statusText = isLive ? 'UP' : 'Down'
    const tooltipText = isLive
      ? 'Socket server on Render is running.'
      : 'Server is starting. Please wait 10-20s (free tier idle wakeup).'
  
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
            style={{
              backgroundColor: isLive ? 'rgba(22, 163, 74, 0.5)' : 'rgba(239, 68, 68, 0.5)',
            }}
              className={`text-slate-500 -3 py-1 rounded-full text-sm font-bold cursor-default`}
            >
              Render: {statusText}
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }
  
  
  

  const checkRenderStatus = async () => {
    try {
      const res = await fetch("https://boardstorm-sockets.onrender.com/rooms", {
        method: "GET",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        if (!isLive) {
          setIsLive(true);
          toast.success("Render started, enjoy!", {
            duration: 2000,
            position: "bottom-right",
          });
        }
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else {
        toast.error("Render is starting, please wait...", {
          duration: 2000,
          position: "bottom-right",
        });
        throw new Error("Render not ready yet");
      }
    } catch (error) {
      if (!isLive) {
        setIsLive(false);
        toast.error("Render is starting, please wait...", {
          duration: 2000,
          position: "bottom-right",
        });

        // Retry every 15s if not already retrying
        if (!intervalRef.current) {
          intervalRef.current = setInterval(checkRenderStatus, 15000);
        }
      }
    }
  };

  useEffect(() => {
    if (showToast) {
      checkRenderStatus();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [showToast]);

  return (
    <RenderServiceContext.Provider
      value={{ isLive, getStatus: () => isLive, setShowToast, RenderStatusBadge }}
    >
      {children}
    </RenderServiceContext.Provider>
  );
}

export const useRenderServiceStatus = () => useContext(RenderServiceContext);
