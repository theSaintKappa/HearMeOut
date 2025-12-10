"use client";

import { Check, Grid3X3, Laptop, Moon, Rows3, Settings, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useId } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useSettingsStore } from "@/lib/store";
import { PRIMARY_APP_COLORS, type PrimaryAppColor, type ViewMode } from "@/lib/types";
import { cn } from "@/lib/utils";

export function SettingsPopover() {
    const id = useId();
    const { viewMode, primaryAppColor, setViewMode, setPrimaryColor } = useSettingsStore();
    const { theme, setTheme, resolvedTheme } = useTheme();

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button id={`settings-trigger-${id}`} variant="outline" size="icon">
                    <Settings />
                    <span className="sr-only">Settings</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col p-0 w-fit">
                <div className="flex flex-col gap-2 p-4">
                    <h3 className="font-medium">Theme</h3>
                    <ToggleGroup variant="outline" spacing={2} type="single" size="sm" value={theme} onValueChange={(value: string | "") => value !== "" && setTheme(value)}>
                        <ToggleGroupItem className="rounded-sm!" value="light">
                            <Sun />
                            Light
                        </ToggleGroupItem>
                        <ToggleGroupItem value="dark">
                            <Moon />
                            Dark
                        </ToggleGroupItem>
                        <ToggleGroupItem value="system">
                            <Laptop />
                            System
                        </ToggleGroupItem>
                    </ToggleGroup>
                </div>
                <Separator />
                <div className="flex flex-col gap-2 p-4">
                    <h3 className="font-medium">Primary App Color</h3>
                    <ToggleGroup variant="outline" spacing={2} type="single" size="sm" value={primaryAppColor} onValueChange={(value: PrimaryAppColor | "") => value !== "" && setPrimaryColor(value)}>
                        {PRIMARY_APP_COLORS.map((color) => (
                            <ToggleGroupItem key={color} className="group relative size-8 p-0 overflow-hidden rounded-full" value={color}>
                                <div className={cn("inset-0 size-full bg-primary", color, resolvedTheme)} />
                                <Check className="absolute hidden stroke-3 stroke-white drop-shadow-[0_0_1px_black] group-data-[state=on]:block" />
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                    <p className="capitalize text-muted-foreground text-sm">{primaryAppColor}</p>
                </div>
                <Separator />
                <div className="flex flex-col gap-2 p-4">
                    <h3 className="font-medium">View Mode</h3>
                    <ToggleGroup variant="outline" spacing={2} type="single" size="sm" value={viewMode} onValueChange={(value: ViewMode | "") => value !== "" && setViewMode(value)}>
                        <ToggleGroupItem value="grid">
                            <Grid3X3 />
                            <span>Grid</span>
                        </ToggleGroupItem>
                        <ToggleGroupItem value="list">
                            <Rows3 />
                            <span>List</span>
                        </ToggleGroupItem>
                    </ToggleGroup>
                </div>
            </PopoverContent>
        </Popover>
    );
}
