"use client";

import { LoaderPinwheel } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function SignInButton() {
    const [isSigningIn, setIsSigningIn] = useState(false);

    const signIn = async () => {
        setIsSigningIn(true);
        await authClient.signIn.social({
            provider: "spotify",
            callbackURL: "/me",
            errorCallbackURL: "/",
        });
    };

    return (
        <Button size="lg" className="font-bold rounded-full text-lg py-6 bg-spotify-green hover:bg-spotify-green/90 text-shadow-[0_0_6px_rgb(0,0,0,0.5)] shadow-xl hover:shadow-2xl hover:scale-[1.04] active:scale-[0.98] transition-transform duration-150" onClick={signIn} disabled={isSigningIn}>
            {isSigningIn ? <LoaderPinwheel className="size-6 animate-spin" /> : <Image className="size-6 drop-shadow-[0_0_6px_rgb(0,0,0,0.5)]" src="/Spotify_Logo.svg" alt="Spotify logo" width={32} height={32} priority />}
            Connect with Spotify
        </Button>
    );
}
