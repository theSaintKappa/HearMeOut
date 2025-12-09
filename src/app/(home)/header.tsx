"use client";

import { AppWindowMac, BarChart3, Check, Github, Globe, Grid3X3, Laptop, LogOut, Moon, Rows3, Settings, ShieldHalf, Sun, User, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { authClient } from "@/lib/auth-client";
import { useSettingsStore } from "@/lib/store";
import { PRIMARY_APP_COLORS, type PrimaryAppColor, type ViewMode } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Header() {
    return (
        <header className="border-b bg-card/50 h-18 shadow-[0_2px_6px_black]">
            <div className="mx-auto max-w-7xl h-full flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                    <Image className="size-7" src="/HearMeOut_Logo.svg" alt="HearMeOut logo" width={32} height={32} priority />
                    <h1 className="font-black text-2xl">HearMeOut</h1>
                </div>
                <div className="h-full flex items-center gap-2">
                    <SettingsPopover />
                    <UserPopover />
                </div>
            </div>
        </header>
    );
}

function SettingsPopover() {
    const { viewMode, primaryAppColor, setViewMode, setPrimaryColor } = useSettingsStore();
    const { theme, setTheme, resolvedTheme } = useTheme();

    useEffect(() => {
        document.documentElement.classList.remove(...PRIMARY_APP_COLORS);
        document.documentElement.classList.add(primaryAppColor);
    }, [primaryAppColor]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
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

function UserPopover() {
    const { data: session } = authClient.useSession();

    const pathname = usePathname();
    const isOnSharePage = pathname?.startsWith("/share/");

    const signOut = async () => {
        await authClient.signOut({
            fetchOptions: { onSuccess: () => redirect("/") },
        });
    };

    const regionName = new Intl.DisplayNames(["en"], { type: "region" });

    return (
        <Popover>
            <PopoverTrigger className="cursor-pointer h-full rounded-full outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                <Avatar className="border-2 border-primary p-0.5 h-full w-auto aspect-square">
                    <AvatarImage className="rounded-full" src={session?.user.image ?? undefined} alt="User avatar" />
                    <AvatarFallback>
                        <User className="size-4" />
                    </AvatarFallback>
                </Avatar>
                <span className="sr-only">User menu</span>
            </PopoverTrigger>
            {session?.user && (
                <PopoverContent className="p-0">
                    <div className="flex flex-col p-4">
                        <div className="flex items-center gap-2">
                            <h2 className="font-semibold text-md">{session.user.name}</h2>
                            <Badge className="capitalize py-0 px-1.5">{session.user.product}</Badge>
                        </div>
                        <span className="text-muted-foreground text-sm">{session.user.email}</span>
                    </div>
                    <Separator />
                    <div className="flex flex-col p-4 gap-2 text-sm">
                        <div className="flex items-center justify-between">
                            <div className="text-muted-foreground flex items-center gap-2">
                                <Users className="size-4" />
                                Followers
                            </div>
                            <span className="font-semibold">{session.user.followers}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="text-muted-foreground flex items-center gap-2">
                                <Globe className="size-4" />
                                Country
                            </div>
                            <span className="font-medium">{regionName.of(session.user.country)}</span>
                        </div>
                    </div>
                    <Separator />
                    {isOnSharePage && (
                        <>
                            <div className="grid p-2">
                                <Button variant="ghost" className="justify-start font-bold" asChild>
                                    <Link href="/me">
                                        <BarChart3 className="size-4" />
                                        View My Stats
                                    </Link>
                                </Button>
                            </div>
                            <Separator />
                        </>
                    )}
                    <div className="grid p-2">
                        <Button variant="ghost" className="justify-start" asChild>
                            <a href={session.user.uri} rel="noopener noreferrer">
                                <AppWindowMac className="size-4" />
                                Open in Spotify
                            </a>
                        </Button>
                        <Button variant="ghost" className="justify-start" asChild>
                            <a href="https://github.com/theSaintKappa/HearMeOut" target="_blank" rel="noopener noreferrer">
                                <Github className="size-4" />
                                View Repository
                            </a>
                        </Button>
                        <Button variant="ghost" className="justify-start" asChild>
                            <Link href="/privacy">
                                <ShieldHalf className="size-4" />
                                Privacy Policy
                            </Link>
                        </Button>
                        <Button variant="ghost" className="justify-start text-destructive hover:text-destructive" onClick={() => signOut()}>
                            <LogOut className="size-4" />
                            Sign Out
                        </Button>
                    </div>
                </PopoverContent>
            )}
        </Popover>
    );
}
