import { AppWindowMac, Calendar, Clock, DiscAlbum, Users } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Track } from "@/lib/types";
import { formatDuration, formatReleaseDate } from "@/lib/utils";

export function TrackDialog({ track, children }: { track: Track; children: React.ReactNode }) {
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader className="sr-only">
                    <DialogTitle>{track.name}</DialogTitle>
                    <DialogDescription>Track details window</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 overflow-hidden">
                    <div className="flex gap-4">
                        <div className="size-32 rounded-md bg-secondary shadow-md overflow-hidden shrink-0">
                            <Image src={track.album.images[0].url} alt={track.name} width={640} height={640} className="object-cover size-full" />
                        </div>
                        <div className="flex flex-col justify-center min-w-0">
                            <h2 className="truncate text-xl font-bold">{track.name}</h2>
                            <p className="text-sm text-muted-foreground line-clamp-3">
                                {track.artists.flatMap((artist, index) => [
                                    index > 0 && ", ",
                                    <a key={artist.uri} className="hover:underline underline-offset-2 hover:text-foreground whitespace-nowrap" href={artist.uri}>
                                        {artist.name}
                                    </a>,
                                ])}
                            </p>
                            <div className="text-sm text-muted-foreground flex items-center gap-1 mt-2">
                                <Clock className="size-4" />
                                {formatDuration(track.durationMs)}
                            </div>
                        </div>
                    </div>
                    <Button className="w-full" asChild>
                        <a href={track.uri}>
                            <AppWindowMac />
                            Open in Spotify
                        </a>
                    </Button>
                    <div className="rounded-lg bg-muted-foreground/8 p-4 space-y-3">
                        <h3 className="font-semibold capitalize">{track.album.albumType}</h3>
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <DiscAlbum className="size-4 shrink-0" />
                                <a className="hover:underline underline-offset-2 hover:text-foreground truncate" href={track.album.uri}>
                                    {track.album.name}
                                </a>
                            </p>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <Users className="size-4 shrink-0" />
                                <div className="line-clamp-3">
                                    {track.album.artists.flatMap((artist, index) => [
                                        index > 0 && ", ",
                                        <a key={artist.uri} className="hover:underline underline-offset-2 hover:text-foreground whitespace-nowrap" href={artist.uri}>
                                            {artist.name}
                                        </a>,
                                    ])}
                                </div>
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <Calendar className="size-4" />
                                <p className="truncate">{formatReleaseDate(track.album.releaseDate, track.album.releaseDatePrecision)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
