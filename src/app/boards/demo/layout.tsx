import type { Metadata } from "next";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import SingleBoardTemplate from "@/components/templates/SingleBoardTemplate";
import { BoardContextProvider } from "@/contexts/BoardContext";
import RenderServiceProvider from "@/contexts/RenderServiceContext";


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

          <Suspense>
      
          <BoardContextProvider>
            <SidebarProvider>
              <RenderServiceProvider>
      
                <>
                  <AppSidebar />
                  <SingleBoardTemplate children={children} />
                </>
      
      
      
      
              </RenderServiceProvider>
            </SidebarProvider>
          </BoardContextProvider>
          </Suspense>
  );
}
