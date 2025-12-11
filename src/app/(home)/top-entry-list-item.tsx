import { Clock, Stars } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Artist, ContentType, TopEntryProps, Track } from "@/lib/types";
import { formatDuration as formatDuration, formatFollowers } from "@/lib/utils";
import { ArtistDialog } from "./artist-dialog";
import { TrackDialog } from "./track-dialog";

export function TopEntryListItem<T extends ContentType>({ type, data, index }: TopEntryProps<T>) {
    const [isLoaded, setIsLoaded] = useState(false);

    if (type === "tracks") {
        const track = data as Track;
        return (
            <TrackDialog track={track}>
                <button
                    className="grid md:grid-cols-[auto_auto_2fr_1fr_auto] grid-cols-[auto_auto_1fr] py-2 px-4 gap-4 items-center bg-muted-foreground/8 rounded-md border outline-none cursor-pointer group hover:bg-muted-foreground/16 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] w-full text-left"
                    type="button"
                >
                    <span className="text-sm font-black font-mono text-muted-foreground">{index + 1}</span>
                    <div className="overflow-hidden rounded-[3px] bg-muted">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: isLoaded ? 1 : 0 }} transition={{ duration: 0.25 }}>
                            <Image src={track.album.images[1].url} alt={track.name} width={300} height={300} onLoad={() => setIsLoaded(true)} className="object-cover group-hover:scale-110 transition-transform size-12" />
                        </motion.div>
                    </div>
                    <div className="min-w-0">
                        <h4 className="font-bold text-sm truncate">{track.name}</h4>
                        <p className="text-xs text-muted-foreground truncate">{track.artists.map((artist) => artist.name).join(", ")}</p>
                    </div>
                    <div className="min-w-0 hidden md:block">
                        <p className="text-sm truncate">{track.album.name}</p>
                        <p className="text-xs text-muted-foreground truncate capitalize">{track.album.albumType}</p>
                    </div>
                    <div className="hidden md:flex gap-6">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="text-muted-foreground flex items-center gap-1">
                                    <Clock className="size-4" />
                                    <span className="text-sm font-mono">{formatDuration(track.durationMs)}</span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Track duration</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="text-muted-foreground flex items-center gap-1">
                                    <Stars className="size-4" />
                                    <span className="text-sm font-mono">{track.popularity}/100</span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Track popularity</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </button>
            </TrackDialog>
        );
    }

    const artist = data as Artist;
    return (
        <ArtistDialog artist={artist}>
            <button
                className="grid md:grid-cols-[auto_auto_1fr_auto] grid-cols-[auto_auto_1fr] py-2 px-4 gap-4 items-center bg-muted-foreground/8 rounded-md border outline-none cursor-pointer group hover:bg-muted-foreground/16 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] w-full text-left"
                type="button"
            >
                <span className="text-sm font-black font-mono text-muted-foreground">{index + 1}</span>
                <div className="overflow-hidden rounded-full bg-muted">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: isLoaded ? 1 : 0 }} transition={{ duration: 0.25 }}>
                        <Image src={artist.images[1].url} alt={artist.name} width={320} height={320} onLoad={() => setIsLoaded(true)} className="object-cover group-hover:scale-110 transition-transform size-12" />
                    </motion.div>
                </div>
                <div className="min-w-0">
                    <h4 className="font-bold text-sm truncate">{artist.name}</h4>
                    <p className="text-xs text-muted-foreground truncate">{artist.genres.join(", ")}</p>
                </div>
                <div className="hidden md:flex gap-6">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="text-muted-foreground flex items-center gap-1">
                                <Clock className="size-4" />
                                <span className="text-sm font-mono">{formatFollowers(artist.followers)}</span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Artist followers</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="text-muted-foreground flex items-center gap-1">
                                <Stars className="size-4" />
                                <span className="text-sm">{artist.popularity}/100</span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Artist popularity</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </button>
        </ArtistDialog>
    );
}
