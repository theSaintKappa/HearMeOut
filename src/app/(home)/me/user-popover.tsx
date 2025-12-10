"use client";

import { AppWindowMac, Github, Globe, LogOut, ShieldHalf, User, Users } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useId } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";

export function UserPopover() {
    const id = useId();
    const { data: session } = authClient.useSession();

    const signOut = async () => {
        await authClient.signOut({ fetchOptions: { onSuccess: () => redirect("/") } });
    };

    const regionName = new Intl.DisplayNames(["en"], { type: "region" });

    return (
        <Popover>
            <PopoverTrigger id={`user-trigger-${id}`} className="cursor-pointer h-full rounded-full outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
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
