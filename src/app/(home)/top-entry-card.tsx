"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import type { Artist, ContentType, TopEntryProps, Track } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ArtistDialog } from "./artist-dialog";
import { TrackDialog } from "./track-dialog";

export function TopEntryCard<T extends ContentType>({ type, data, index }: TopEntryProps<T>) {
    const [isLoaded, setIsLoaded] = useState(false);
    const imageUrl = type === "tracks" ? (data as Track).album.images[0]?.url : (data as Artist).images[0]?.url;
    const title = data.name;
    const subtitle = type === "tracks" ? (data as Track).artists.map((artist) => artist.name).join(", ") : (data as Artist).genres.join(", ");

    const cardContent = (
        <button className="relative bg-muted-foreground/8 size-full rounded-md border outline-none cursor-pointer group hover:bg-muted-foreground/16 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]" type="button">
            <div className="overflow-hidden rounded-[inherit] size-full flex flex-col sm:p-4 sm:gap-4">
                <div className="overflow-hidden rounded-[3px] bg-muted aspect-square">
                    <motion.div className="size-full" initial={{ opacity: 0 }} animate={{ opacity: isLoaded ? 1 : 0 }} transition={{ duration: 0.25 }}>
                        <Image src={imageUrl} alt={title} width={640} height={640} priority={index !== undefined && index < 6} onLoad={() => setIsLoaded(true)} className="object-cover size-full group-hover:scale-105 transition-transform" />
                    </motion.div>
                </div>
                <div className="flex-1 flex flex-col justify-center sm:text-center text-start sm:p-0 p-2 min-h-[2lh]">
                    <h4 className={cn("font-bold sm:text-sm text-xs", subtitle ? "truncate" : "line-clamp-2")}>{title}</h4>
                    <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
                </div>
            </div>
            <div className="absolute sm:top-2 sm:left-2 -top-1 -left-1 bg-primary rounded-full sm:h-7 sm:min-w-7 h-6 min-w-6 px-1.75 flex items-center justify-center ring-2 sm:ring-card ring-background">
                <span className="sm:text-sm text-xs text-primary-foreground font-black font-mono">{index + 1}</span>
            </div>
        </button>
    );

    if (type === "tracks") {
        return <TrackDialog track={data as Track}>{cardContent}</TrackDialog>;
    }

    return <ArtistDialog artist={data as Artist}>{cardContent}</ArtistDialog>;
}
