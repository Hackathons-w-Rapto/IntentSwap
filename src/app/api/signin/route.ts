import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
    const { walletAddress } = await req.json();

    const mockUsers = [
        {
            id: 1,
            walletAddress: "0x1234",
            context: []
        }
    ]

    const user = await mockUsers.find(walletAddress);
    console.log(user);

    if(!user) {
        return NextResponse.json({
            error: "User not found",
            status: "404"
        })
    }

    const token = walletAddress * 10;

    return NextResponse.json({
        error: null,
        message: "Login Successful",
        token: token,
        status: "200"
    });
    } catch (err) {
        return NextResponse.json({
            error: "An error occurred",
            status: "500"
        })
    }
}