"use client";

import { io, Socket } from "socket.io-client";




export class SocketClass {
    private static socket: Socket;
    
    constructor() {}

    static getInstance(): Socket {
        if (!this.socket) {
            this.socket = io("http://localhost:5000", {
                autoConnect: false,
                withCredentials: true, // Must match server credentials
                transports: ["websocket"], // Ensure WebSocket transport is used
            });
        }
        return this.socket;
    }


}

