import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/lib/auth";
import { FloatingLines } from "./floating-lines";
import { OAuthErrorHandler } from "./oauth-error-handler";
import { RotatingText } from "./rotating-text";
import { SignInButton } from "./sign-in-button";

export default async function Home() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session) redirect("/me");

    return (
        <div className="h-screen supports-[height:100dvh]:h-dvh overflow-hidden flex justify-center items-center bg-background text-foreground dark">
            <div className="absolute size-full brightness-50">
                <FloatingLines enabledWaves={["top", "middle", "bottom"]} lineCount={[8, 6, 8]} lineDistance={[10, 12, 12]} bendRadius={0} bendStrength={0} />
            </div>
            <header className="z-10 fixed top-4">
                <div className="flex items-center gap-2">
                    <Image className="invert" src="/HearMeOut_Logo.svg" alt="HearMeOut logo" width={32} height={32} priority />
                    <h1 className="font-black text-3xl">HearMeOut</h1>
                </div>
            </header>
            <main className="z-10 w-full max-w-4xl p-2 flex flex-col items-center gap-8 text-center">
                <div className="flex flex-col gap-4">
                    <h2 className="flex md:flex-row flex-col justify-center items-center gap-2 font-bold sm:text-5xl text-3xl">
                        <span className="text-shadow-[0_0_16px_rgb(0,0,0,0.5)]">Your Music Taste,</span>
                        <RotatingText
                            texts={["Visualized", "Explored", "Shared", "Celebrated"]}
                            mainClassName="bg-primary text-primary-foreground font-black justify-center rounded-lg overflow-hidden"
                            staggerFrom="last"
                            staggerDuration={0.025}
                            splitLevelClassName="overflow-hidden px-2 sm:py-1.5 py-0.25"
                            transition={{ type: "spring", damping: 35, stiffness: 400 }}
                            rotationInterval={4000}
                            animatePresenceMode="popLayout"
                        />
                    </h2>
                    <p className="md:text-lg text-base font-medium text-shadow-[0_0_16px_rgb(0,0,0,0.5)] leading-snug text-balance">
                        Get a front-row seat to your own music taste.
                        <br />
                        See which artists dominate your playlists and which tracks you can't stop replaying.
                    </p>
                </div>
                <SignInButton />
            </main>
            <footer className="z-10 fixed bottom-4">
                <div className="text-xs font-medium space-x-2">
                    <span>Not affiliated with Spotify</span>
                    <span className="font-black">&bull;</span>
                    <Link className="text-primary hover:underline" href="/privacy">
                        Privacy Policy
                    </Link>
                </div>
            </footer>
            <Suspense>
                <OAuthErrorHandler />
            </Suspense>
            <Toaster richColors theme="dark" />
        </div>
    );
}
