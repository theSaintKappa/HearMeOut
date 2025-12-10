"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { useHMOStore } from "@/lib/store";
import type { Artist, SharedStatsResponse, TimeRange, Track } from "@/lib/types";
import { fetcher } from "@/lib/utils";
import { CollectionView } from "../../collection-view";

interface SharedCollectionProps {
    userId: string;
}

const TIME_RANGE_KEY_MAP: Record<TimeRange, { tracks: keyof SharedStatsResponse["sharedStats"]; artists: keyof SharedStatsResponse["sharedStats"] }> = {
    short_term: { tracks: "tracksShortTerm", artists: "artistsShortTerm" },
    medium_term: { tracks: "tracksMediumTerm", artists: "artistsMediumTerm" },
    long_term: { tracks: "tracksLongTerm", artists: "artistsLongTerm" },
};

export function PublicCollectionWrapper({ userId }: SharedCollectionProps) {
    const { contentType, timeRange } = useHMOStore();

    const { data, error, isLoading } = useSWR<SharedStatsResponse, Error>(`/api/shared/${userId}`, fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale: false,
    });

    useEffect(() => {
        if (error) toast.error("Failed to load shared stats", { description: (error.cause ? (error.cause as { error: string }).error : error.message) || undefined });
    }, [error]);

    const items: (Artist | Track)[] = data ? (contentType === "tracks" ? (data.sharedStats[TIME_RANGE_KEY_MAP[timeRange].tracks] as Track[]) : (data.sharedStats[TIME_RANGE_KEY_MAP[timeRange].artists] as Artist[])) : [];

    return <CollectionView items={items} contentType={contentType} isLoading={isLoading} />;
}
