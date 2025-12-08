import { create } from "zustand";
import type { ContentType, TimeRange, ViewMode } from "@/lib/types";

interface HMOStore {
    contentType: ContentType;
    timeRange: TimeRange;
    viewMode: ViewMode;
    setContentType: (type: ContentType) => void;
    setTimeRange: (range: TimeRange) => void;
    setViewMode: (mode: ViewMode) => void;
}

export const useHMOStore = create<HMOStore>((set) => ({
    contentType: "tracks",
    timeRange: "short_term",
    viewMode: "grid",
    setContentType: (type) => set({ contentType: type }),
    setTimeRange: (range) => set({ timeRange: range }),
    setViewMode: (mode) => set({ viewMode: mode }),
}));
