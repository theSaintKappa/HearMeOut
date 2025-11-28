"use client";

import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
    const signOut = async () => {
        await authClient.signOut({
            fetchOptions: { onSuccess: () => redirect("/") },
        });
    };

    return <Button onClick={signOut}>Sign Out</Button>;
}
