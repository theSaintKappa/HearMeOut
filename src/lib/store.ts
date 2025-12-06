import { create } from "zustand";
import type { ContentType, TimeRange, TopItems, ViewMode } from "@/lib/types";

interface HMOStore extends Record<ContentType, Record<TimeRange, TopItems<ContentType>>> {
    contentType: ContentType;
    timeRange: TimeRange;
    viewMode: ViewMode;
    setTopItems: <T extends ContentType>(type: T, range: TimeRange, items: TopItems<T>) => void;
    setContentType: (type: ContentType) => void;
    setTimeRange: (range: TimeRange) => void;
    setViewMode: (mode: ViewMode) => void;
}

export const useHMOStore = create<HMOStore>((set, get) => ({
    artists: { short_term: [], medium_term: [], long_term: [] },
    tracks: { short_term: [], medium_term: [], long_term: [] },
    contentType: "tracks",
    timeRange: "short_term",
    viewMode: "grid",
    setTopItems: (type, range, items) =>
        set({
            [type]: {
                ...get()[type],
                [range]: items,
            },
        }),
    setContentType: (type) => set({ contentType: type }),
    setTimeRange: (range) => set({ timeRange: range }),
    setViewMode: (mode) => set({ viewMode: mode }),
}));
