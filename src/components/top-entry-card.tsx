"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import type { Artist, ContentType, TopEntryProps, Track } from "@/lib/types";

export function TopEntryCard<T extends ContentType>({ type, data, index }: TopEntryProps<T>) {
    const [isLoaded, setIsLoaded] = useState(false);
    const imageUrl = type === "tracks" ? (data as Track).album.images[0]?.url : (data as Artist).images[0]?.url;
    const title = data.name;
    const subtitle = type === "tracks" ? (data as Track).artists.map((artist) => artist.name).join(", ") : (data as Artist).genres.join(", ");

    return (
        <button className="relative bg-card/50 h-full rounded-md border outline-none p-3 overflow-hidden flex flex-col gap-2 cursor-pointer group hover:bg-card focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]" type="button">
            <div className="overflow-hidden rounded-[3px] bg-muted aspect-square">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: isLoaded ? 1 : 0 }} transition={{ duration: 0.25 }}>
                    <Image src={imageUrl} alt={title} width={640} height={640} priority={index !== undefined && index < 6} onLoad={() => setIsLoaded(true)} className="object-cover group-hover:scale-105 transition-transform" />
                </motion.div>
            </div>
            <div className="flex-1 flex flex-col justify-center">
                <h3 className="font-bold text-sm line-clamp-1">{title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-1">{subtitle}</p>
            </div>
            <div className="absolute top-2 left-2 bg-primary rounded-full h-6 min-w-6 px-1.75 flex items-center justify-center ring-2 ring-card">
                <span className="text-xs font-black font-mono">{index + 1}</span>
            </div>
        </button>
    );
}
