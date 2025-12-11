"use client";

import { LoaderPinwheel } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export function SignInButton() {
    const [isSigningIn, setIsSigningIn] = useState(false);

    const signIn = async () => {
        try {
            setIsSigningIn(true);
            await authClient.signIn.social({ provider: "spotify", callbackURL: "/me", errorCallbackURL: "/" });
        } catch {
            toast.error("Authentication failed. Please try again.");
        } finally {
            setIsSigningIn(false);
        }
    };

    return (
        <button className="rounded-full overflow-hidden relative p-0.5 cursor-pointer font-bold transition-transform hover:scale-105 active:scale-95 group" onClick={signIn} disabled={isSigningIn} type="button">
            <span className={cn("absolute inset-[-200%] animate-[spin_2.5s_linear_infinite] bg-[conic-gradient(from_90deg,transparent_30%,#FFFFFF_100%)] blur-md transition-opacity opacity-35 group-hover:opacity-100")} />
            <span className="bg-background text-foreground group-disabled:pointer-events-none group-disabled:text-muted-foreground transition-colors hover:bg-background/95 rounded-full px-4 py-3 flex items-center justify-center gap-2 relative">
                {isSigningIn ? (
                    <LoaderPinwheel className="animate-spin size-5" />
                ) : (
                    <svg className="size-5 fill-foreground group-disabled:fill-muted-foreground" width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.6347 0.0128653C7.80464 -0.338115 0.362381 6.53524 0.0128627 15.3653C-0.338118 24.1954 6.53672 31.6362 15.3654 31.9871C24.1955 32.3381 31.6363 25.4648 31.9872 16.6347C32.3368 7.80462 25.4634 0.362383 16.6347 0.0128653ZM23.3882 23.4525C23.1893 23.8035 22.8018 23.9789 22.4245 23.9263C22.3089 23.9102 22.1934 23.8722 22.0852 23.8108C19.9705 22.6072 17.6657 21.8233 15.2352 21.4811C12.8047 21.1389 10.3727 21.2574 8.00792 21.8321C7.49461 21.9564 6.97837 21.642 6.85407 21.1287C6.72976 20.6154 7.04418 20.0992 7.55749 19.9748C10.1577 19.3431 12.831 19.2129 15.5014 19.5888C18.1717 19.9646 20.7047 20.826 23.0314 22.1495C23.4891 22.4112 23.65 22.9933 23.3897 23.4525H23.3882ZM25.4912 19.2524C25.165 19.8549 24.4104 20.0801 23.8079 19.754C21.3335 18.4159 18.6543 17.537 15.845 17.1421C13.0357 16.7473 10.2191 16.854 7.47121 17.458C7.32204 17.4902 7.17434 17.4961 7.03102 17.4756C6.53234 17.4054 6.10531 17.0339 5.99124 16.5118C5.84354 15.8421 6.26764 15.1796 6.93743 15.0319C9.97488 14.3636 13.0884 14.2451 16.1916 14.6809C19.2934 15.1167 22.2548 16.0877 24.9896 17.5677C25.5935 17.8938 25.8173 18.647 25.4912 19.251V19.2524ZM27.8223 14.5171C27.5152 15.1079 26.8761 15.4136 26.2531 15.3258C26.0849 15.3024 25.9197 15.2498 25.7603 15.1679C22.8793 13.6689 19.776 12.6789 16.5368 12.224C13.2975 11.7692 10.0407 11.8657 6.85846 12.5121C6.03073 12.6803 5.22493 12.1451 5.05675 11.3188C4.88858 10.4911 5.42382 9.68529 6.25009 9.51711C9.77452 8.80199 13.3779 8.69523 16.9623 9.1983C20.5467 9.70137 23.9805 10.7982 27.1715 12.458C27.9202 12.847 28.2113 13.7698 27.8223 14.5186V14.5171Z" />
                    </svg>
                )}
                Continue with Spotify
            </span>
        </button>
    );
}
