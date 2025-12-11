"use client";

import { ArrowDownToLine } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSettingsStore } from "@/lib/store";
import type { Artist, ContentType, Track } from "@/lib/types";
import { TopEntryCard } from "./top-entry-card";
import { TopEntryListItem } from "./top-entry-list-item";

const SKELETON_COUNT = 96;
const CONTENT_TYPE_ORDER: ContentType[] = ["tracks", "artists"];

export interface CollectionViewProps {
    items: (Artist | Track)[];
    contentType: ContentType;
    isLoading: boolean;
    // Pagination props (optional - for /me page)
    pagination?: {
        total: number;
        hasMore: boolean;
        isLoadingMore: boolean;
        remainingItems: number;
        onLoadMore: () => void;
    };
}

export function CollectionView({ items, contentType, isLoading, pagination }: CollectionViewProps) {
    const { viewMode } = useSettingsStore();
    const prevContentTypeRef = useRef<ContentType>(contentType);
    const prevViewModeRef = useRef(viewMode);

    const getSlideDirection = () => {
        const prevIndex = CONTENT_TYPE_ORDER.indexOf(prevContentTypeRef.current);
        const currentIndex = CONTENT_TYPE_ORDER.indexOf(contentType);
        return currentIndex > prevIndex ? 1 : -1;
    };

    const slideDirection = getSlideDirection();
    const slideDirectionRef = useRef(slideDirection);

    if (prevContentTypeRef.current !== contentType) slideDirectionRef.current = slideDirection;

    const isViewModeChange = prevViewModeRef.current !== viewMode;

    useEffect(() => {
        prevContentTypeRef.current = contentType;
        prevViewModeRef.current = viewMode;
    }, [contentType, viewMode]);

    const skeletonIds = useMemo(() => Array.from({ length: SKELETON_COUNT }, () => `skeleton-${crypto.randomUUID()}`), []);

    const gridClassName = viewMode === "grid" ? "grid sm:gap-4 gap-2 sm:grid-cols-[repeat(auto-fit,minmax(185px,1fr))] grid-cols-3 list-none" : "flex flex-col gap-2 list-none";

    return (
        <AnimatePresence mode="popLayout" initial={false}>
            <motion.ol key={contentType} className={gridClassName} initial={{ opacity: 0, x: slideDirectionRef.current * 200 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: slideDirectionRef.current * 200 }} transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}>
                <LayoutGroup>
                    {isLoading ? (
                        <AnimatePresence>{skeletonIds.map((id, index) => (viewMode === "grid" ? <CardSkeleton key={id} index={index} /> : <ListItemSkeleton key={id} index={index} />))}</AnimatePresence>
                    ) : (
                        items.map((item, index) => (
                            <motion.li
                                key={item.uri}
                                layout={!isViewModeChange}
                                layoutId={!isViewModeChange ? `${contentType}-${item.uri}` : undefined}
                                initial={pagination?.isLoadingMore ? { opacity: 0 } : false}
                                animate={{ opacity: 1 }}
                                transition={{
                                    layout: { type: "spring", stiffness: 250, damping: 30 },
                                    opacity: { duration: 0.2, delay: Math.min(index * 0.01, 0.3) },
                                }}
                            >
                                {viewMode === "grid" ? <TopEntryCard type={contentType} data={item} index={index} /> : <TopEntryListItem type={contentType} data={item} index={index} />}
                            </motion.li>
                        ))
                    )}
                    {pagination?.isLoadingMore && skeletonIds.map((id, index) => (viewMode === "grid" ? <CardSkeleton key={id} index={index} /> : <ListItemSkeleton key={id} index={index} />))}
                </LayoutGroup>
                {pagination?.hasMore && !pagination.isLoadingMore && (
                    <div className="col-span-full flex justify-center py-4">
                        <Button size="lg" onClick={pagination.onLoadMore}>
                            <ArrowDownToLine />
                            Load More ({pagination.remainingItems} {contentType} remaining)
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
                <Skeleton className="sm:h-4 h-3 sm:mx-auto" style={{ width: `${((index * 7) % 41) + 40}%` }} />
                <Skeleton className="sm:h-3 h-2 sm:mx-auto" style={{ width: `${((index * 11) % 41) + 40}%` }} />
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
