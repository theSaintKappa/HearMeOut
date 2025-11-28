"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function OAuthErrorHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const error = searchParams.get("error");
        if (error) {
            router.replace("/");
            toast.error("Authentication failed. Please try again.", { description: `Error: ${error}` });
        }
    }, [searchParams, router]);

    return null;
}
