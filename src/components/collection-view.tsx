"use client";

import { ArrowDownToLine } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";
import useSWRInfinite from "swr/infinite";
import { useHMOStore, useSettingsStore } from "@/lib/store";
import type { Artist, ContentType, TopItemsResponse, Track } from "@/lib/types";
import { TopEntryCard } from "./top-entry-card";
import { TopEntryListItem } from "./top-entry-list-item";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

const PAGE_SIZE = 96;
const CONTENT_TYPE_ORDER: ContentType[] = ["tracks", "artists"];

const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`An error occurred while fetching "${url}"`, { cause: await res.json() });
    return res.json();
};

export function CollectionView() {
    const { contentType, timeRange } = useHMOStore();
    const { viewMode } = useSettingsStore();
    const prevContentTypeRef = useRef<ContentType>(contentType);
    const prevTimeRangeRef = useRef(timeRange);
    const prevViewModeRef = useRef(viewMode);

    const getSlideDirection = () => {
        const prevIndex = CONTENT_TYPE_ORDER.indexOf(prevContentTypeRef.current);
        const currentIndex = CONTENT_TYPE_ORDER.indexOf(contentType);
        return currentIndex > prevIndex ? 1 : -1;
    };

    const slideDirection = getSlideDirection();
    const slideDirectionRef = useRef(slideDirection);

    if (prevContentTypeRef.current !== contentType) slideDirectionRef.current = slideDirection;

    const isTimeRangeChange = prevTimeRangeRef.current !== timeRange;
    const isViewModeChange = prevViewModeRef.current !== viewMode;

    useEffect(() => {
        prevContentTypeRef.current = contentType;
        prevTimeRangeRef.current = timeRange;
        prevViewModeRef.current = viewMode;
    }, [contentType, timeRange, viewMode]);

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

    const gridClassName = viewMode === "grid" ? "grid sm:gap-4 gap-2 sm:grid-cols-[repeat(auto-fit,minmax(185px,1fr))] grid-cols-3 list-none" : "flex flex-col gap-2 list-none";

    return (
        <AnimatePresence mode="popLayout" initial={false}>
            <motion.ol key={contentType} className={gridClassName} initial={{ opacity: 0, x: slideDirectionRef.current * 200 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: slideDirectionRef.current * 200 }} transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}>
                <LayoutGroup>
                    {isLoading ? (
                        <AnimatePresence>{skeletonIds.map((id, index) => (viewMode === "grid" ? <CardSkeleton key={id} index={index} /> : <ListItemSkeleton key={id} index={index} />))}</AnimatePresence>
                    ) : (
                        data &&
                        allItems.map((item, index) => (
                            <motion.li
                                key={item.uri}
                                layout={!isViewModeChange}
                                layoutId={!isViewModeChange ? `${contentType}-${item.uri}` : undefined}
                                initial={!isTimeRangeChange && !isViewModeChange && isLoadingMore ? { opacity: 0 } : false}
                                animate={{ opacity: 1 }}
                                transition={{
                                    layout: { type: "spring", stiffness: 250, damping: 30 },
                                    opacity: { duration: 0.2, delay: Math.min(index * 0.01, 0.3) },
                                }}
                            >
                                {viewMode === "grid" ? <TopEntryCard type={data[0].contentType} data={item} index={index} /> : <TopEntryListItem type={data[0].contentType} data={item} index={index} />}
                            </motion.li>
                        ))
                    )}
                    {isLoadingMore && skeletonIds.map((id, index) => (viewMode === "grid" ? <CardSkeleton key={id} index={index} /> : <ListItemSkeleton key={id} index={index} />))}
                </LayoutGroup>
                {hasMore && !isLoadingMore && (
                    <div className="col-span-full flex justify-center py-4">
                        <Button size="lg" onClick={() => setSize(size + 1)}>
                            <ArrowDownToLine />
                            Load More ({remainingItems} {contentType} remaining)
                        </Button>
                    </div>
                )}
            </motion.ol>
        </AnimatePresence>
    );
}

function CardSkeleton({ index }: { index: number }) {
    return (
        <motion.li
            layout
            layoutId={`skeleton-${index}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ layout: { type: "spring", stiffness: 350, damping: 30 }, opacity: { duration: 0.3, delay: index * 0.02, ease: "easeOut" }, scale: { duration: 0.3, delay: index * 0.02, ease: "easeOut" } }}
            className="bg-muted-foreground/8 rounded-md border flex flex-col sm:p-4 sm:gap-4"
        >
            <Skeleton className="w-full aspect-square rounded-[3px]" />
            <div className="flex-1 flex flex-col justify-center gap-2 sm:p-0 p-2 min-h-[2lh]">
                <Skeleton className="h-4 sm:mx-auto" style={{ width: `${((index * 7) % 41) + 40}%` }} />
                <Skeleton className="h-3 sm:mx-auto" style={{ width: `${((index * 11) % 41) + 40}%` }} />
            </div>
        </motion.li>
    );
}

function ListItemSkeleton({ index }: { index: number }) {
    return (
        <motion.li
            layout
            layoutId={`list-skeleton-${index}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ layout: { type: "spring", stiffness: 350, damping: 30 }, opacity: { duration: 0.3, delay: index * 0.02, ease: "easeOut" }, scale: { duration: 0.3, delay: index * 0.02, ease: "easeOut" } }}
            className="grid md:grid-cols-[auto_auto_2fr_1fr_auto] grid-cols-[auto_auto_1fr] py-2 px-4 gap-4 items-center bg-muted-foreground/8 rounded-md border"
        >
            <Skeleton className="w-6 h-4" />
            <Skeleton className="w-12 h-12 rounded-[3px] shrink-0" />
            <div className="space-y-1.5 min-w-0">
                <Skeleton className="h-4" style={{ width: `${((index * 7) % 31) + 20}%` }} />
                <Skeleton className="h-3" style={{ width: `${((index * 11) % 21) + 15}%` }} />
            </div>
            <div className="space-y-1.5 min-w-0 hidden md:block">
                <Skeleton className="h-4" style={{ width: `${((index * 11) % 31) + 30}%` }} />
                <Skeleton className="h-3" style={{ width: `${((index * 7) % 21) + 20}%` }} />
            </div>
            <div className="hidden md:flex gap-6">
                <Skeleton className="w-16 h-4" />
                <Skeleton className="w-16 h-4" />
            </div>
        </motion.li>
    );
}
