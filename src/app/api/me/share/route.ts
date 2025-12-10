import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { type Artist, CONTENT_TYPES, type ContentType, type SpotifyArtist, type SpotifyTopItemsResponse, type SpotifyTrack, TIME_RANGES, type TimeRange, type Track } from "@/lib/types";
import { mapSpotifyArtist, mapSpotifyTrack } from "@/lib/utils";

const SHARED_STATS_FETCH_LIMIT = 100;

type OrganizedStats = Record<ContentType, Record<TimeRange, (Track | Artist)[]>>;

export async function GET() {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

        const sharedStats = await prisma.sharedStats.findUnique({ where: { userId: session.user.id } });

        if (!sharedStats) return Response.json({ hasSharedStats: false });
        return Response.json({ hasSharedStats: true, userId: sharedStats.userId, createdAt: sharedStats.createdAt, updatedAt: sharedStats.updatedAt });
    } catch (error) {
        console.error("Error checking shared stats:", error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST() {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

        const { accessToken } = await auth.api.getAccessToken({ body: { providerId: "spotify" }, headers: await headers() });
        if (!accessToken) return Response.json({ error: "Failed to get Spotify access token" }, { status: 401 });

        const requestsNeeded = Math.ceil(SHARED_STATS_FETCH_LIMIT / 50);
        const requests: Promise<SpotifyTopItemsResponse<ContentType> & { contentType: ContentType; timeRange: TimeRange }>[] = [];

        for (const contentType of CONTENT_TYPES) {
            for (const timeRange of TIME_RANGES) {
                requests.push(
                    ...Array.from({ length: requestsNeeded }, (_, i) => {
                        const requestOffset = i * 50;
                        const requestLimit = Math.min(50, SHARED_STATS_FETCH_LIMIT - i * 50);

                        return fetch(`https://api.spotify.com/v1/me/top/${contentType}?time_range=${timeRange}&limit=${requestLimit}&offset=${requestOffset}`, {
                            headers: { Authorization: `Bearer ${accessToken}` },
                        }).then((response) => {
                            if (!response.ok) throw new Error(`Spotify API error: ${response.status}`);
                            return response.json().then((data) => ({ ...data, contentType, timeRange }));
                        });
                    }),
                );
            }
        }

        const responses = await Promise.all(requests);

        const { tracks, artists }: OrganizedStats = {
            tracks: { short_term: [], medium_term: [], long_term: [] },
            artists: { short_term: [], medium_term: [], long_term: [] },
        };

        for (const response of responses) {
            const { contentType, timeRange, items } = response;

            if (contentType === "tracks") tracks[timeRange].push(...(items as SpotifyTrack[]).map(mapSpotifyTrack));
            else artists[timeRange].push(...(items as SpotifyArtist[]).map(mapSpotifyArtist));
        }

        const sharedStats = await prisma.sharedStats.upsert({
            where: { userId: session.user.id },
            create: {
                userId: session.user.id,
                tracksShortTerm: JSON.parse(JSON.stringify(tracks.short_term)),
                tracksMediumTerm: JSON.parse(JSON.stringify(tracks.medium_term)),
                tracksLongTerm: JSON.parse(JSON.stringify(tracks.long_term)),
                artistsShortTerm: JSON.parse(JSON.stringify(artists.short_term)),
                artistsMediumTerm: JSON.parse(JSON.stringify(artists.medium_term)),
                artistsLongTerm: JSON.parse(JSON.stringify(artists.long_term)),
            },
            update: {
                tracksShortTerm: JSON.parse(JSON.stringify(tracks.short_term)),
                tracksMediumTerm: JSON.parse(JSON.stringify(tracks.medium_term)),
                tracksLongTerm: JSON.parse(JSON.stringify(tracks.long_term)),
                artistsShortTerm: JSON.parse(JSON.stringify(artists.short_term)),
                artistsMediumTerm: JSON.parse(JSON.stringify(artists.medium_term)),
                artistsLongTerm: JSON.parse(JSON.stringify(artists.long_term)),
            },
        });

        return Response.json({ hasSharedStats: true, userId: sharedStats.userId, createdAt: sharedStats.createdAt, updatedAt: sharedStats.updatedAt });
    } catch (error) {
        console.error("Error creating shared stats:", error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE() {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

        await prisma.sharedStats.delete({ where: { userId: session.user.id } });

        return Response.json({ hasSharedStats: false });
    } catch (error) {
        console.error("Error deleting shared stats:", error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}
