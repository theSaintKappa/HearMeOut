import type { Artist as SpotifyArtist, Track as SpotifyTrack } from "@spotify/web-api-ts-sdk";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { AlbumType, Artist, ReleaseDatePrecision, Track } from "@/lib/types";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

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
