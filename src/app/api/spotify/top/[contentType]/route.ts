import type { Artist as SpotifyArtist, Track as SpotifyTrack } from "@spotify/web-api-ts-sdk";
import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import type { SpotifyTopItemsResponse } from "@/lib/types";
import { mapSpotifyArtist, mapSpotifyTrack } from "@/lib/utils";

const querySchema = z.object({
    timeRange: z.enum(["short_term", "medium_term", "long_term"]).optional().default("medium_term"),
    limit: z.coerce.number().min(1).max(500).optional().default(50),
    offset: z.coerce.number().min(0).optional().default(0),
});

export async function GET(request: NextRequest, { params }: RouteContext<"/api/spotify/top/[contentType]">) {
    try {
        const { contentType } = await params;
        if (contentType !== "artists" && contentType !== "tracks") return Response.json({ error: "Invalid type. Use 'artists' or 'tracks'" }, { status: 400 });

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

            return fetch(`https://api.spotify.com/v1/me/top/${contentType}?time_range=${timeRange}&limit=${requestLimit}&offset=${requestOffset}`, {
                headers: { Authorization: `Bearer ${accessToken.accessToken}` },
            }).then((response) => {
                if (!response.ok) throw new Error(`Spotify API error: ${response.status}`);
                return response.json() as Promise<SpotifyTopItemsResponse<typeof contentType>>;
            });
        });

        const responses = await Promise.all(requests);

        const total = responses[0]?.total || 0;
        const totalItemsOffset = offset + responses.reduce((sum, r) => sum + r.items.length, 0);
        const nextOffset = totalItemsOffset < total ? totalItemsOffset : null;

        const spotifyItems = responses.flatMap((r) => r.items);
        const items = contentType === "tracks" ? (spotifyItems as SpotifyTrack[]).map(mapSpotifyTrack) : (spotifyItems as SpotifyArtist[]).map(mapSpotifyArtist);

        return Response.json({ contentType, limit, offset, total, nextOffset, items });
    } catch (error) {
        console.error("Error in request processing:", error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}
