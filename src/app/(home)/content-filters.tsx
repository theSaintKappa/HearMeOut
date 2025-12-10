"use client";

import { CircleUser, Disc } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useHMOStore } from "@/lib/store";
import type { ContentType, TimeRange } from "@/lib/types";

export function ContentFilters() {
    const { contentType, timeRange, setContentType, setTimeRange } = useHMOStore();

    return (
        <nav className="flex md:flex-row flex-col justify-between items-center gap-2" aria-label="Content filters">
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
            <ToggleGroup className="bg-muted-foreground/8 p-1" type="single" size="sm" value={timeRange} onValueChange={(value: TimeRange | "") => value !== "" && setTimeRange(value)}>
                <ToggleGroupItem className="rounded-sm!" value="short_term">
                    Last 4 Weeks
                </ToggleGroupItem>
                <ToggleGroupItem className="rounded-sm!" value="medium_term">
                    Last 6 Months
                </ToggleGroupItem>
                <ToggleGroupItem className="rounded-sm!" value="long_term">
                    Last Year
                </ToggleGroupItem>
            </ToggleGroup>
        </nav>
    );
}
