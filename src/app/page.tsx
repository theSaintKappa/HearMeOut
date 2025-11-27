import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import FloatingLines from "@/components/floating-lines";
import RotatingText from "@/components/rotating-text";
import { Button } from "@/components/ui/button";

export default function Home() {
    return (
        <div className="h-screen supports-[height:100dvh]:h-dvh overflow-hidden flex justify-center items-center dark bg-background text-foreground text-shadow-[0_0_6px_rgb(0,0,0,1)]">
            <div className="absolute size-full brightness-60">
                <FloatingLines enabledWaves={["top", "middle", "bottom"]} lineCount={[15, 10, 15]} lineDistance={[8, 6, 4]} bendRadius={0} bendStrength={0} interactive={true} parallax={true} />
            </div>
            <header className="z-10 fixed top-4">
                <h2 className="inline-flex items-center gap-2 font-bold text-3xl">
                    <Image src="/HearMeOut_Logo.svg" alt="HearMeOut logo" width={32} height={32} priority />
                    <span>HearMeOut</span>
                </h2>
            </header>
            <main className="z-10 w-full max-w-4xl p-4 flex flex-col items-center gap-8 text-center">
                <div className="flex flex-col gap-4">
                    <h1 className="flex flex-wrap items-center justify-center gap-2 font-black text-4xl sm:text-5xl">
                        <span>Your Music Taste,</span>
                        <RotatingText
                            texts={["Visualized", "Discovered", "Shared", "Celebrated!"]}
                            mainClassName="bg-primary text-primary-foreground justify-center rounded-lg overflow-hidden"
                            staggerFrom="last"
                            staggerDuration={0.025}
                            splitLevelClassName="overflow-hidden p-2"
                            transition={{ type: "spring", damping: 35, stiffness: 400 }}
                            rotationInterval={4000}
                            animatePresenceMode="popLayout"
                        />
                    </h1>
                    <p className="flex flex-col text-md sm:text-2xl font-semibold text-balance leading-tight">
                        <span>
                            <span className="font-black">Top Songs</span> & <span className="font-black">Favourite Artists</span> <span className="italic">brought to life!</span>
                        </span>
                        <span className="italic">Share them and let your friends judge you</span>
                    </p>
                </div>
                <Button size="lg" className="font-bold rounded-full text-lg py-6 bg-spotify-green hover:bg-spotify-green/90 text-shadow-[0_0_6px_rgb(0,0,0,0.5)] shadow-xl hover:shadow-2xl hover:scale-[1.04] active:scale-[0.98] transition-transform duration-150">
                    <Image className="size-6 drop-shadow-[0_0_6px_rgb(0,0,0,0.5)]" src="/Spotify_Logo.svg" alt="Spotify logo" width={32} height={32} priority />
                    Connect with Spotify
                </Button>
            </main>
            <footer className="z-10 fixed bottom-4">
                <div className="flex flex-col items-center gap-1 text-xs font-medium">
                    <div className="flex items-center gap-1">
                        Made with <Heart className="fill-primary stroke-none size-4" /> by
                        <a href="https://github.com/theSaintKappa" target="_blank" rel="noopener noreferrer">
                            Wojtek
                        </a>
                    </div>
                    <div className="space-x-2">
                        <span>Not affiliated with Spotify</span>
                        <span className="font-black">&bull;</span>
                        <Link className="text-primary hover:underline" href="/privacy">
                            Privacy Policy
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
