import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const userId = params?.id; // Ensure id exists and is an array
    console.log("User ID:", userId);

    if (!userId) {
        console.log("User ID not present");
        return NextResponse.json({ msg: "Invalid user id" }, { status: 400 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                boards: true
            }
        });

        if (!user) {
            return NextResponse.json({ msg: "User not found!" }, { status: 404 });
        }

        return NextResponse.json({ user });
    } catch (e) {
        console.error("Error:", e);
        return NextResponse.json({ msg: "Internal Server Error!" }, { status: 500 });
    }
}
