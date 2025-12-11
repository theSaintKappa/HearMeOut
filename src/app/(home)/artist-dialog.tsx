import { AppWindowMac } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Artist } from "@/lib/types";
import { formatFollowers } from "@/lib/utils";

export function ArtistDialog({ artist, children }: { artist: Artist; children: React.ReactNode }) {
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader className="sr-only">
                    <DialogTitle>{artist.name}</DialogTitle>
                    <DialogDescription>Artist details window</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 overflow-hidden">
                    <div className="size-48 rounded-full bg-secondary shadow-md overflow-hidden mx-auto">
                        <Image src={artist.images[0].url} alt={artist.name} width={640} height={640} className="object-cover size-full" />
                    </div>
                    <div className="space-y-3 text-center">
                        <h2 className="truncate text-2xl font-bold">{artist.name}</h2>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {artist.genres.map((genre) => (
                                <Badge key={genre} variant="secondary">
                                    {genre}
                                </Badge>
                            ))}
                        </div>
                    </div>
                    <div className="grid w-full grid-cols-2 gap-4 rounded-lg bg-muted-foreground/8 p-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-primary">{formatFollowers(artist.followers)}</p>
                            <p className="text-sm text-muted-foreground">Followers</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-primary">
                                {artist.popularity}
                                <span className="text-xs">/100</span>
                            </p>
                            <p className="text-sm text-muted-foreground">Popularity</p>
                        </div>
                    </div>
                    <Button className="w-full" asChild>
                        <a href={artist.uri}>
                            <AppWindowMac />
                            Open in Spotify
                        </a>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
