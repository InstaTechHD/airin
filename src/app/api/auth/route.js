import { getServerSession } from "next-auth";
import { NextResponse } from 'next/server';
import { authOptions } from "./[...nextauth]/route";

export async function GET(req) {
    const session = await getServerSession(authOptions);

    // Check if the user is authenticated
    if (session) {
        // User is authenticated
        return NextResponse.json({
            success: true,
            message: "User is authenticated",
            session: session,
        });
    } else {
        // User is not authenticated
        return NextResponse.json({
            success: false,
            message: "User is not authenticated",
        });
    }
}
