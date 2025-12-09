import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ContentType, TimeRange, ViewMode } from "@/lib/types";

interface HMOStore {
    contentType: ContentType;
    timeRange: TimeRange;
    setContentType: (type: ContentType) => void;
    setTimeRange: (range: TimeRange) => void;
}

export const useHMOStore = create<HMOStore>((set) => ({
    contentType: "tracks",
    timeRange: "short_term",
    setContentType: (type) => set({ contentType: type }),
    setTimeRange: (range) => set({ timeRange: range }),
}));

interface SettingsStore {
    viewMode: ViewMode;
    primaryColor: string;
    setViewMode: (mode: ViewMode) => void;
    setPrimaryColor: (color: string) => void;
}

export const useSettingsStore = create<SettingsStore>()(
    persist(
        (set) => ({
            viewMode: "grid",
            primaryColor: "purple",
            setViewMode: (mode) => set({ viewMode: mode }),
            setPrimaryColor: (color) => set({ primaryColor: color }),
        }),
        { name: "hmo-settings" },
    ),
);
