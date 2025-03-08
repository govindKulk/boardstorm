import type { Metadata } from "next";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import SingleBoardTemplate from "@/components/templates/SingleBoardTemplate";
import { BoardContextProvider } from "@/contexts/BoardContext";


export const metadata: Metadata = {
  title: "Board | BoardStorm",
  description: "Single board page for the board",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <SidebarProvider>
      <BoardContextProvider>
        <>
        <AppSidebar />
        <SingleBoardTemplate children={children} />
        </>



      </BoardContextProvider>
    </SidebarProvider>
  );
}
