import type { Artist as SpotifyArtist, Page as SpotifyPage, Track as SpotifyTrack } from "@spotify/web-api-ts-sdk";
import type { SpotifyProfile } from "better-auth/social-providers";

export interface SpotifyTopItemsResponse<T extends ContentType> extends SpotifyPage<T extends "artists" ? SpotifyArtist : SpotifyTrack> {}
export type { SpotifyArtist, SpotifyTrack };

type TopItemsPagination = {
    limit: number;
    offset: number;
    total: number;
    nextOffset: number | null;
};
export type TopItemsResponse = (TopItemsPagination & { contentType: "tracks"; items: Track[] }) | (TopItemsPagination & { contentType: "artists"; items: Artist[] });

export interface ExtendedProfile extends SpotifyProfile {
    country: string;
    external_urls: { spotify: string };
    uri: string;
    followers: { total: number };
    product: string;
}

export const CONTENT_TYPES = ["tracks", "artists"] as const;
export type ContentType = (typeof CONTENT_TYPES)[number];

export const TIME_RANGES = ["short_term", "medium_term", "long_term"] as const;
export type TimeRange = (typeof TIME_RANGES)[number];

export type ViewMode = "grid" | "list";

export type AlbumType = "album" | "single" | "compilation";
export type ReleaseDatePrecision = "year" | "month" | "day";

export const PRIMARY_APP_COLORS = ["violet", "blue", "green", "yellow", "orange", "rose", "red", "default"] as const;
export type PrimaryAppColor = (typeof PRIMARY_APP_COLORS)[number];

interface Image {
    url: string;
    height: number | null;
    width: number | null;
}

interface SimplifiedArtist {
    url: string;
    name: string;
    uri: string;
}

export type TopItems<T extends ContentType> = T extends "tracks" ? Track[] : Artist[];

export interface Track {
    album: {
        albumType: AlbumType;
        url: string;
        images: Image[];
        name: string;
        releaseDate: string;
        releaseDatePrecision: ReleaseDatePrecision;
        uri: string;
        artists: SimplifiedArtist[];
    };
    artists: SimplifiedArtist[];
    durationMs: number;
    explicit: boolean;
    url: string;
    name: string;
    popularity: number;
    uri: string;
}

export interface Artist {
    url: string;
    followers: number;
    genres: string[];
    images: Image[];
    name: string;
    popularity: number;
    uri: string;
}

export interface TopEntryProps<T extends ContentType> {
    type: T;
    data: T extends "tracks" ? Track : Artist;
    index: number;
}

export type ShareStatusResponse =
    | {
          hasSharedStats: true;
          userId: string;
          createdAt: string;
          updatedAt: string;
      }
    | {
          hasSharedStats: false;
      };

export interface SharedStatsData {
    id: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    tracksShortTerm: Track[];
    tracksMediumTerm: Track[];
    tracksLongTerm: Track[];
    artistsShortTerm: Artist[];
    artistsMediumTerm: Artist[];
    artistsLongTerm: Artist[];
}

export interface SharedStatsResponse {
    sharedStats: SharedStatsData;
}
