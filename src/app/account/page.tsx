"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { UserIcon, MailIcon, CalendarIcon, LayoutDashboardIcon, PencilIcon } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/homepage/navbar"
import { Footer } from "@/components/homepage/footer"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import AccountPageSkeleton from "@/components/skeletons/AccountPageSkeleton"


// This would normally come from your database
// For demo purposes, we're using mock data
const mockUser = {
    id: "1234567890",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    hashedPassword: "hashed_password_would_be_here",
    emailVerified: new Date("2023-01-15"),
    image: null,
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2023-04-20"),
    boards: [
        { id: "1", title: "Marketing Strategy" },
        { id: "2", title: "Product Roadmap" },
        { id: "3", title: "Q2 Goals" },
    ],
}

export default function AccountPage() {
    // const user = mockUser
    const [user, setUser] = useState(mockUser);


    const {status, userId} =  useAuth()

        
    const router = useRouter();
    
    
    useEffect(() => {
       
        if(status === "unauthenticated"){
            router.push('/signin');
        }

        async function fetchUser() {
            const res = await fetch(`/api/me/${userId}`)
            const resData = await res.json();
            console.log("user is : ", resData);
            setUser(resData.user);

        }

        fetchUser();
    }, [userId, status])
    // Format dates
    const createdAtFormatted = new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    })

    const emailVerifiedFormatted = user.emailVerified
        ? new Date(user.emailVerified).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : "Not verified"


    if(status !== "authenticated" || !user){
        return <AccountPageSkeleton/>
    }


    return (
        <div className="min-h-screen flex flex-col">

            <main className="flex-1 container max-w-6xl mx-auto px-4 py-8">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold">Account</h1>
                        <p className="text-muted-foreground">Manage your account settings and preferences</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Profile Summary Card */}
                        <Card className="md:col-span-1">
                            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={user.image || ""} alt={user.name || "User"} />
                                    <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                                        {user.name ? user.name.substring(0, 2).toUpperCase() : "US"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <CardTitle>{user.name}</CardTitle>
                                    <CardDescription>{user.email}</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                                        <div className="flex flex-col">
                                            <span className="text-sm text-muted-foreground">Member since</span>
                                            <span className="font-medium">{createdAtFormatted}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <LayoutDashboardIcon className="h-5 w-5 text-muted-foreground" />
                                        <div className="flex flex-col">
                                            <span className="text-sm text-muted-foreground">Boards</span>
                                            <span className="font-medium">{user.boards.length}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline" className="w-full" asChild>
                                    <Link href="/account/edit">
                                        <PencilIcon className="mr-2 h-4 w-4" />
                                        Edit Profile
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>

                        {/* Account Details */}
                        <div className="md:col-span-2">
                            <Tabs defaultValue="profile" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="profile">Profile</TabsTrigger>
                                    <TabsTrigger value="boards">Boards</TabsTrigger>
                                </TabsList>
                                <TabsContent value="profile" className="mt-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Profile Information</CardTitle>
                                            <CardDescription>Your personal information and account details</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                                        <UserIcon className="h-4 w-4" />
                                                        Name
                                                    </div>
                                                    <div className="font-medium">{user.name || "Not provided"}</div>
                                                </div>

                                                <Separator />

                                                <div className="space-y-2">
                                                    <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                                        <MailIcon className="h-4 w-4" />
                                                        Email
                                                    </div>
                                                    <div className="font-medium">{user.email}</div>
                                                    <div className="text-sm text-muted-foreground">Verified: {emailVerifiedFormatted}</div>
                                                </div>

                                                <Separator />

                                                <div className="space-y-2">
                                                    <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                                        <CalendarIcon className="h-4 w-4" />
                                                        Account Created
                                                    </div>
                                                    <div className="font-medium">{createdAtFormatted}</div>
                                                </div>

                                                <Separator />

                                                <div className="space-y-2">
                                                    <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                                        <CalendarIcon className="h-4 w-4" />
                                                        Last Updated
                                                    </div>
                                                    <div className="font-medium">
                                                        {new Date(user.updatedAt).toLocaleDateString("en-US", {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="flex justify-between">
                                            <Button variant="outline" asChild>
                                                <Link href="/account/change-password">Change Password</Link>
                                            </Button>
                                            <Button asChild>
                                                <Link href="/account/edit">Edit Profile</Link>
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="boards" className="mt-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Your Boards</CardTitle>
                                            <CardDescription>Manage your created boards</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4 divide-y divide-muted">
                                                {user.boards.length > 0 ? (
                                                    user.boards.map((board, index) => (
                                                        <div key={board.id} className="flex items-center justify-between w-full">
                                                            <div className="font-medium">{board.title}</div>
                                                            <Button variant="outline" size="sm" asChild>
                                                                <Link href={`/board/${board.id}`}>Open</Link>
                                                            </Button>

                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-center py-6">
                                                        <p className="text-muted-foreground">You haven't created any boards yet.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                        <CardFooter>
                                            <Button className="w-full" asChild>
                                                <Link href="/boards">
                                                    <LayoutDashboardIcon className="mr-2 h-4 w-4" />
                                                    View All Boards
                                                </Link>
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

