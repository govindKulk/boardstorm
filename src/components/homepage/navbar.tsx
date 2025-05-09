"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/homepage/mode-toggle"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { FaRegLightbulb } from "react-icons/fa"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { UserMenu } from "@/components/user-menu"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { useAuth } from "@/contexts/AuthContext"
import BrandLogo from "./BrandLogo"

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Kanban Boards",
    href: "/features/kanban",
    description: "Visualize your workflow and optimize productivity with customizable boards.",
  },
  {
    title: "Mind Maps",
    href: "/features/mind-maps",
    description: "Organize your thoughts and brainstorm ideas with interactive mind maps.",
  },
  {
    title: "Flowcharts",
    href: "/features/flowcharts",
    description: "Create professional flowcharts to document processes and workflows.",
  },
  {
    title: "Wireframes",
    href: "/features/wireframes",
    description: "Design user interfaces and prototype your applications quickly.",
  },
  {
    title: "Collaborative Editing",
    href: "/features/collaboration",
    description: "Work together in real-time with your team members from anywhere.",
  },
  {
    title: "Templates",
    href: "/templates",
    description: "Get started quickly with pre-built templates for various use cases.",
  },
]

export function Navbar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = React.useState(false);

  // set sheetOpen to false when the user clicks on a link
  const handleLinkClick = () => {
    setSheetOpen(false);
  };


  if (pathname.split('/')[1] == 'boards') {
    return;
  }
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">

        <BrandLogo />


        {/* Desktop Navigation */}
        <div className="hidden md:flex md:gap-10">
          <NavigationMenu>
            <NavigationMenuList>
              {/* <NavigationMenuItem>
                <NavigationMenuTrigger>Features</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {components.map((component) => (
                      <ListItem key={component.title} title={component.title} href={component.href}>
                        {component.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem> */}

              {/* <NavigationMenuItem>
                <Link href="/pricing" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Pricing</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/blog" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Blog</NavigationMenuLink>
                </Link>
              </NavigationMenuItem> */}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex md:gap-2">
            <UserMenu
              onSignOut={() => signOut()}
            />
          </div>
          <ModeToggle />

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link  href="/features" className="text-lg font-medium" onClick={() => setSheetOpen(false)}>
                    Features
                  </Link>
                  <Link  href="/solutions" className="text-lg font-medium" onClick={() => setSheetOpen(false)}>
                    Solutions
                  </Link>
                  <Link  href="/pricing" className="text-lg font-medium" onClick={() => setSheetOpen(false)}>
                    Pricing
                  </Link>
                  <Link  href="/blog" className="text-lg font-medium" onClick={() => setSheetOpen(false)}>
                    Blog
                  </Link>
                  <div className="flex flex-col gap-2 mt-4">
                    <UserMenu onSignOut={() => {
                      console.log("Sign out clicked");
                      setSheetOpen(false); // Close the sheet on sign out
                    }}  />
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  },
)
ListItem.displayName = "ListItem"

