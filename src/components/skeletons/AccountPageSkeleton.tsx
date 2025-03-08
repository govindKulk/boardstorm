import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function AccountPageSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 container h-full ">
            {/* Profile Summary Skeleton */}
            <Card className="md:col-span-1">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="flex flex-col space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                </CardContent>
                <CardFooter>
                    <Skeleton className="h-10 w-full" />
                </CardFooter>
            </Card>

            {/* Tabs Skeleton */}
            <div className="md:col-span-2">
                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </TabsList>
                    <TabsContent value="profile" className="mt-6">
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-4 w-48" />
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <Skeleton className="h-4 w-full" />
                                    <Separator />
                                    <Skeleton className="h-4 w-full" />
                                    <Separator />
                                    <Skeleton className="h-4 w-full" />
                                    <Separator />
                                    <Skeleton className="h-4 w-full" />
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Skeleton className="h-10 w-32" />
                                <Skeleton className="h-10 w-32" />
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
