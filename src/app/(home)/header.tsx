"use client";

import { AppWindowMac, BarChart3, Github, Globe, LogOut, Settings, ShieldHalf, User, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";

export function Header() {
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
        <header className="border-b bg-card/50 h-18 shadow-[0_2px_6px_black]">
            <div className="mx-auto max-w-7xl h-full flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                    <Image className="size-7" src="/HearMeOut_Logo.svg" alt="HearMeOut logo" width={32} height={32} priority />
                    <h1 className="font-black text-2xl">HearMeOut</h1>
                </div>
                <div className="h-full flex items-center gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Settings />
                                <span className="sr-only">Settings</span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent></PopoverContent>
                    </Popover>
                    <Popover>
                        <PopoverTrigger className="cursor-pointer h-full">
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
                                        <span className="font-semibold text-md">{session.user.name}</span>
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
                </div>
            </div>
        </header>
    );
}
