"use client";

import { CircleUser, Disc } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useHMOStore } from "@/lib/store";
import type { ContentType, TimeRange } from "@/lib/types";

export function ContentSelectors() {
    const { contentType, timeRange, setContentType, setTimeRange } = useHMOStore();

    return (
        <section className="flex md:flex-row flex-col justify-between items-center gap-2">
            <ToggleGroup type="single" variant="ghost" spacing={2} size="lg" value={contentType} onValueChange={(value: ContentType | "") => value !== "" && setContentType(value)}>
                <ToggleGroupItem className="font-bold group px-8 gap-4" value="tracks">
                    <Disc className="group-data-[state=on]:stroke-primary" />
                    Tracks
                </ToggleGroupItem>
                <ToggleGroupItem className="font-bold group px-8 gap-4" value="artists">
                    <CircleUser className="group-data-[state=on]:stroke-primary" />
                    Artists
                </ToggleGroupItem>
            </ToggleGroup>
            {/* <ToggleGroup className="bg-card p-1" type="single" size="sm" value={viewMode} onValueChange={handleViewModeChange}>
                    <ToggleGroupItem className="rounded-sm! px-2" value="grid">
                        <Grid3X3 />
                        <span className="sr-only">Grid View</span>
                    </ToggleGroupItem>
                    <ToggleGroupItem className="rounded-sm! px-2" value="list">
                        <Rows3 />
                        <span className="sr-only">List View</span>
                    </ToggleGroupItem>
                </ToggleGroup> */}
            <ToggleGroup className="bg-card p-1" type="single" size="sm" value={timeRange} onValueChange={(value: TimeRange | "") => value !== "" && setTimeRange(value)}>
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
        </section>
    );
}
