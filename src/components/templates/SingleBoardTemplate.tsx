"use client"
import React from "react";
import { SidebarProvider, SidebarTrigger, useSidebar } from "../ui/sidebar";
import { AppSidebar } from "../app-sidebar";

export default function SingleBoardTemplate(
    {
        children
    }: {children: React.ReactNode}
) {

    const {open} = useSidebar();

    return (
  


   
            <div className={`${open ? 'w-[calc(100vw-255px)]': 'w-full'}`}>
              {children}
            </div>



    )
}