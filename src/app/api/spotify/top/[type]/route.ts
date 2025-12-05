import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import type { SpotifyTopItemsResponse, TopItemsResponse } from "@/lib/types";
import { mapSpotifyArtist, mapSpotifyTrack } from "@/lib/utils";

const querySchema = z.object({
    timeRange: z.enum(["short_term", "medium_term", "long_term"]).optional().default("medium_term"),
    limit: z.coerce.number().min(1).max(500).optional().default(50),
    offset: z.coerce.number().min(0).optional().default(0),
});

export async function GET(request: NextRequest, { params }: RouteContext<"/api/spotify/top/[type]">) {
    try {
        const { type } = await params;
        if (type !== "artists" && type !== "tracks") return Response.json({ error: "Invalid type. Use 'artists' or 'tracks'" }, { status: 400 });

        const parsedQuery = querySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams.entries()));
        if (!parsedQuery.success) return Response.json({ error: "Invalid query parameters", ...z.treeifyError(parsedQuery.error), errors: undefined }, { status: 400 });

        const { timeRange, limit, offset } = parsedQuery.data;

        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

        const accessToken = await auth.api.getAccessToken({ body: { providerId: "spotify" }, headers: await headers() });
        if (!accessToken?.accessToken) return Response.json({ error: "Failed to get Spotify access token" }, { status: 401 });

        const requestsNeeded = Math.ceil(limit / 50);

        const requests = Array.from({ length: requestsNeeded }, (_, i) => {
            const requestOffset = offset + i * 50;
            const requestLimit = Math.min(50, limit - i * 50);

            console.log(`Fetching Spotify top ${type}: time_range=${timeRange}, limit=${requestLimit}, offset=${requestOffset}`);
            return fetch(`https://api.spotify.com/v1/me/top/${type}?time_range=${timeRange}&limit=${requestLimit}&offset=${requestOffset}`, {
                headers: { Authorization: `Bearer ${accessToken.accessToken}` },
            }).then((response) => {
                if (!response.ok) throw new Error(`Spotify API error: ${response.status}`);
                return response.json();
            });
        });

        const responses = await Promise.all(requests);
        const total = responses[0]?.total || 0;

        const nextOffset = offset + responses.reduce((sum, r) => sum + r.items.length, 0);
        const nextAvailableOffset = nextOffset < total ? nextOffset : null;

        if (type === "tracks") {
            const trackResponses = responses as SpotifyTopItemsResponse<typeof type>[];
            const allItems = trackResponses.flatMap((r) => r.items);
            const body: TopItemsResponse<typeof type> = { limit, offset, total, nextOffset: nextAvailableOffset, tracks: allItems.map(mapSpotifyTrack) };
            return Response.json(body);
        }

        const artistResponses = responses as SpotifyTopItemsResponse<typeof type>[];
        const allItems = artistResponses.flatMap((r) => r.items);
        const body: TopItemsResponse<typeof type> = { limit, offset, total, nextOffset: nextAvailableOffset, artists: allItems.map(mapSpotifyArtist) };
        return Response.json(body);
    } catch (error) {
        console.error("Error in request processing:", error);
        return Response.json({ error: "Invalid request parameters" }, { status: 400 });
    }
}
