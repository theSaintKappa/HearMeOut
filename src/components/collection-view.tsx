"use client";

import { ArrowDownToLine } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import useSWRInfinite from "swr/infinite";
import { useHMOStore } from "@/lib/store";
import type { Artist, TopItemsResponse, Track } from "@/lib/types";
import { TopEntryCard } from "./top-entry-card";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

const PAGE_SIZE = 96;

const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`An error occurred while fetching "${url}"`, { cause: await res.json() });
    return res.json();
};

export function CollectionView() {
    const { contentType, timeRange } = useHMOStore();

    const getKey = (pageIndex: number, previousPageData: TopItemsResponse | null) => {
        if (previousPageData && previousPageData.nextOffset === null) return null;
        const offset = pageIndex * PAGE_SIZE;
        return `/api/spotify/top/${contentType}?timeRange=${timeRange}&limit=${PAGE_SIZE}&offset=${offset}`;
    };

    const { data, error, isLoading, isValidating, size, setSize } = useSWRInfinite<TopItemsResponse, Error>(getKey, fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale: false,
        revalidateFirstPage: false,
    });

    const skeletonIds = useMemo(() => Array.from({ length: PAGE_SIZE }, () => `skeleton-${crypto.randomUUID()}`), []);

    const allItems = data ? data.flatMap((page) => page.items as (Artist | Track)[]) : [];
    const total = data?.[0]?.total ?? 0;
    const hasMore = allItems.length < total;
    const isLoadingMore = isValidating && size > 1 && data && data.length < size;
    const remainingItems = total - allItems.length;

    useEffect(() => {
        if (error) toast.error(`Failed to load top ${contentType}`, { description: (error.cause ? (error.cause as { error: string }).error : error.message) || undefined });
    }, [error, contentType]);

    if (isLoading) return skeletonIds.map((id, index) => <CardSkeleton key={id} index={index} />);

    if (data)
        return (
            <>
                {allItems.map((item, index) => (
                    <TopEntryCard key={item.uri} type={data[0].contentType} data={item} index={index} />
                ))}
                {isLoadingMore && skeletonIds.map((id, index) => <CardSkeleton key={id} index={index} />)}
                {hasMore && !isLoadingMore && (
                    <div className="col-span-full flex justify-center py-4">
                        <Button size="lg" onClick={() => setSize(size + 1)}>
                            <ArrowDownToLine />
                            Load More ({remainingItems} {contentType} remaining)
                        </Button>
                    </div>
                )}
            </>
        );
}

function CardSkeleton({ index }: { index: number }) {
    return (
        <motion.div className="bg-card/50 rounded-md p-3 flex flex-col gap-2" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: index * 0.02, ease: "easeOut" }}>
            <Skeleton className="w-full aspect-square rounded-[3px]" />
            <div className="space-y-2">
                <Skeleton className="h-4 mx-auto" style={{ width: `${((index * 7) % 41) + 40}%` }} />
                <Skeleton className="h-3 mx-auto" style={{ width: `${((index * 11) % 41) + 40}%` }} />
            </div>
        </motion.div>
    );
}
