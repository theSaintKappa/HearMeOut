"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import type { Artist, ContentType, Track } from "@/lib/types";

interface ItemCardProps<T extends ContentType> {
    type: T;
    data: T extends "tracks" ? Track : Artist;
    index?: number;
}

export function TopEntryCard<T extends ContentType>({ type, data, index }: ItemCardProps<T>) {
    const [isLoaded, setIsLoaded] = useState(false);
    const imageUrl = type === "tracks" ? (data as Track).album.images[0]?.url : (data as Artist).images[0]?.url;
    const title = data.name;
    const subtitle = type === "tracks" ? (data as Track).artists.map((artist) => artist.name).join(", ") : (data as Artist).genres.join(", ");

    return (
        <button className="bg-card/50 rounded-md border outline-none p-3 overflow-hidden flex flex-col gap-2 cursor-pointer group hover:bg-card focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]" type="button">
            <div className="overflow-hidden rounded-[3px] bg-muted aspect-square">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: isLoaded ? 1 : 0 }} transition={{ duration: 0.25 }}>
                    <Image src={imageUrl} alt={title} width={300} height={300} priority={index !== undefined && index < 6} onLoad={() => setIsLoaded(true)} className="object-cover group-hover:scale-105 transition-transform" />
                </motion.div>
            </div>
            <div>
                <h3 className="font-semibold text-sm line-clamp-1">{title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-1">{subtitle}</p>
            </div>
        </button>
    );
}
