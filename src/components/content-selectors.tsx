"use client";

import { CircleUser, Disc, Grid3X3, Rows3 } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useHMOStore } from "@/lib/store";
import type { ContentType, TimeRange, ViewMode } from "@/lib/types";

export function ContentSelectors() {
    const { contentType, viewMode, timeRange, setContentType, setViewMode, setTimeRange } = useHMOStore();

    const handleContentTypeChange = (value: ContentType | "") => value !== "" && setContentType(value);
    const handleViewModeChange = (value: ViewMode | "") => value !== "" && setViewMode(value);
    const handleTimeRangeChange = (value: TimeRange | "") => value !== "" && setTimeRange(value);

    return (
        <section className="flex justify-between items-center">
            <ToggleGroup type="single" variant="ghost" spacing={2} size="lg" value={contentType} onValueChange={handleContentTypeChange}>
                <ToggleGroupItem className="font-bold group" value="tracks">
                    <Disc className="group-data-[state=on]:stroke-primary" />
                    Tracks
                </ToggleGroupItem>
                <ToggleGroupItem className="font-bold group" value="artists">
                    <CircleUser className="group-data-[state=on]:stroke-primary" />
                    Artists
                </ToggleGroupItem>
            </ToggleGroup>
            <div className="flex gap-2">
                <ToggleGroup className="bg-card p-1" type="single" size="sm" value={viewMode} onValueChange={handleViewModeChange}>
                    <ToggleGroupItem className="rounded-sm! px-2" value="grid">
                        <Grid3X3 />
                        <span className="sr-only">Grid View</span>
                    </ToggleGroupItem>
                    <ToggleGroupItem className="rounded-sm! px-2" value="list">
                        <Rows3 />
                        <span className="sr-only">List View</span>
                    </ToggleGroupItem>
                </ToggleGroup>
                <ToggleGroup className="bg-card p-1" type="single" size="sm" value={timeRange} onValueChange={handleTimeRangeChange}>
                    <ToggleGroupItem className="rounded-sm!" value="short_term">
                        Last 4 weeks
                    </ToggleGroupItem>
                    <ToggleGroupItem className="rounded-sm!" value="medium_term">
                        Last 6 months
                    </ToggleGroupItem>
                    <ToggleGroupItem className="rounded-sm!" value="long_term">
                        Last year
                    </ToggleGroupItem>
                </ToggleGroup>
            </div>
        </section>
    );
}
