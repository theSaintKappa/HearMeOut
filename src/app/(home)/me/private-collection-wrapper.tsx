"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import useSWRInfinite from "swr/infinite";
import { useHMOStore } from "@/lib/store";
import type { Artist, TopItemsResponse, Track } from "@/lib/types";
import { fetcher } from "@/lib/utils";
import { CollectionView } from "../collection-view";

const PAGE_SIZE = 96;

export function PrivateCollectionWrapper() {
    const { contentType, timeRange } = useHMOStore();

    const getKey = (pageIndex: number, previousPageData: TopItemsResponse | null) => {
        if (previousPageData && previousPageData.nextOffset === null) return null;
        const offset = pageIndex * PAGE_SIZE;
        return `/api/me/${contentType}?timeRange=${timeRange}&limit=${PAGE_SIZE}&offset=${offset}`;
    };

    const { data, error, isLoading, isValidating, size, setSize } = useSWRInfinite<TopItemsResponse, Error>(getKey, fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale: false,
        revalidateFirstPage: false,
    });

    const allItems = data ? data.flatMap((page) => page.items as (Artist | Track)[]) : [];
    const total = data?.[0]?.total ?? 0;
    const hasMore = allItems.length < total;
    const isLoadingMore = isValidating && size > 1 && data && data.length < size;
    const remainingItems = total - allItems.length;

    useEffect(() => {
        if (error) toast.error(`Failed to load top ${contentType}`, { description: (error.cause ? (error.cause as { error: string }).error : error.message) || undefined });
    }, [error, contentType]);

    return (
        <CollectionView
            items={allItems}
            contentType={contentType}
            isLoading={isLoading}
            pagination={{
                total,
                hasMore,
                isLoadingMore: isLoadingMore ?? false,
                remainingItems,
                onLoadMore: () => setSize(size + 1),
            }}
        />
    );
}
