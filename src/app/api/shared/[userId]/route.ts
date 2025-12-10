import type { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(_request: NextRequest, { params }: RouteContext<"/api/shared/[userId]">) {
    try {
        const { userId } = await params;

        const sharedStats = await prisma.sharedStats.findUnique({ where: { userId } });
        if (!sharedStats) return Response.json({ error: "No shared stats found for this user" }, { status: 404 });

        return Response.json({ sharedStats });
    } catch (error) {
        console.error("Error checking shared stats:", error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}
