"use client"
import Link from "next/link"
import Image from "next/image"
import { User2Icon, UserIcon, LayoutDashboardIcon, LogOutIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { useEffect } from "react"
import { signOut } from "next-auth/react"
import { useIsMobile } from "@/hooks/use-mobile"
import { BiUserCircle } from "react-icons/bi"
import { BsPerson } from "react-icons/bs"
import { MdPerson2 } from "react-icons/md"
import { RiUser2Fill, RiUser2Line, RiUser3Line } from "react-icons/ri"

interface UserMenuProps {
  onSignOut?: () => void
}

export function UserMenu({ onSignOut = () => signOut() }: UserMenuProps) {

  const {user} = useAuth();

  if (!user) {
    return <SignInButton />
  }

  const handleSignOut = () => {
    if (onSignOut) {
      onSignOut()
    }
  }

  const isMobile = useIsMobile();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="focus:outline-none  text-white  rounded-xl  text-center p-2  font-bold shadow-xl hover:cursor-pointer rounded-full inline-flex ">
          {user.image ? (
            <div className="relative md:h-10 md:w-10 overflow-hidden rounded-full border-2 border-slate-400">
              <Image src={user.image || "/placeholder.svg"} alt={user.name || "User"} fill className="object-cover" />
            </div>
          ) : (
            <RiUser3Line
              size={isMobile ? 20 : 30}
              className="
              text-slate-400
              "
            />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name || "User"}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email || ""}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/account" className="flex w-full cursor-pointer items-center">
            <UserIcon className="mr-2 h-4 w-4" />
            <span>My Account</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/boards" className="flex w-full cursor-pointer items-center">
            <LayoutDashboardIcon className="mr-2 h-4 w-4" />
            <span>My Boards</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          <LogOutIcon className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function SignInButton() {
  return (
    <Button variant="outline" size="sm" asChild>
      <Link href="/signin">Log in</Link>
    </Button>
  )
}

