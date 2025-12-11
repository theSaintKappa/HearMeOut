import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { AlbumType, Artist, ReleaseDatePrecision, SpotifyArtist, SpotifyTrack, Track } from "@/lib/types";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export function mapSpotifyTrack(track: SpotifyTrack): Track {
    return {
        album: {
            albumType: track.album.album_type as AlbumType,
            url: track.album.external_urls.spotify,
            images: track.album.images.map((img) => ({
                url: img.url,
                height: img.height ?? null,
                width: img.width ?? null,
            })),
            name: track.album.name,
            releaseDate: track.album.release_date,
            releaseDatePrecision: track.album.release_date_precision as ReleaseDatePrecision,
            uri: track.album.uri,
            artists: track.album.artists.map((artist) => ({
                url: artist.external_urls.spotify,
                name: artist.name,
                uri: artist.uri,
            })),
        },
        artists: track.artists.map((artist) => ({
            url: artist.external_urls.spotify,
            name: artist.name,
            uri: artist.uri,
        })),
        durationMs: track.duration_ms,
        explicit: track.explicit,
        url: track.external_urls.spotify,
        name: track.name,
        popularity: track.popularity,
        uri: track.uri,
    };
}

export function mapSpotifyArtist(artist: SpotifyArtist): Artist {
    return {
        url: artist.external_urls.spotify,
        followers: artist.followers.total,
        genres: artist.genres,
        images: artist.images.map((img) => ({
            url: img.url,
            height: img.height ?? null,
            width: img.width ?? null,
        })),
        name: artist.name,
        popularity: artist.popularity,
        uri: artist.uri,
    };
}

export function formatDuration(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function formatFollowers(count: number): string {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
}

export function formatReleaseDate(date: string, precision: ReleaseDatePrecision): string {
    const [year, month, day] = date.split("-");

    switch (precision) {
        case "year":
            return year;
        case "month":
            return new Date(Number(year), Number(month) - 1).toLocaleDateString(undefined, { year: "numeric", month: "long" });
        case "day":
            return new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
    }
}

export const fetcher = async (url: string) => {
    console.log("Fetching", url);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`An error occurred while fetching "${url}" with SWR`, { cause: await res.json() });
    return res.json();
};
