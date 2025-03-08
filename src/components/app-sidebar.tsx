import { Calendar, Home, Inbox, Search, Settings, Share } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import LiveShareModalButton from "./LiveShareModal"
import { ModeToggle } from "./homepage/mode-toggle"
import BrandLogo from "./homepage/BrandLogo"
import { BiLeftArrow } from "react-icons/bi"
import Link from "next/link"

// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Live Sharing",
    url: "#",
    icon: LiveShareModalButton,
  },

]

export function AppSidebar() {
  return (
    <Sidebar

    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Board</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                    <LiveShareModalButton />
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>  

                    <ModeToggle showThemeText/>  
         
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarSeparator  className="bg-muted-foreground"/>

              <SidebarMenuItem>
                <div className="w-full px-2 py-2">

                <BrandLogo/>

                </div>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                  href="/boards"
                  >
                  <BiLeftArrow size={20}/> Back to Boards.
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>



            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
