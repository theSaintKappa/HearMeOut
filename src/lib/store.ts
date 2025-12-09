import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ContentType, PrimaryAppColor, TimeRange, ViewMode } from "@/lib/types";

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
    primaryAppColor: PrimaryAppColor;
    setViewMode: (mode: ViewMode) => void;
    setPrimaryColor: (color: PrimaryAppColor) => void;
}

export const useSettingsStore = create<SettingsStore>()(
    persist(
        (set) => ({
            viewMode: "grid",
            primaryAppColor: "violet",
            setViewMode: (mode) => set({ viewMode: mode }),
            setPrimaryColor: (color) => set({ primaryAppColor: color }),
        }),
        { name: "hmo-settings" },
    ),
);
