"use client";

import { useHMOStore } from "@/lib/store";

export function CollectionView() {
    const { contentType, viewMode, timeRange, setContentType, setViewMode, setTimeRange } = useHMOStore();

    return (
        <section className="">
            Collection View - {contentType} - {viewMode} - {timeRange}
        </section>
    );
}
