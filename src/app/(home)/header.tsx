import { headers } from "next/headers";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { ShareDialog } from "./me/share-dialog";
import { UserPopover } from "./me/user-popover";
import { SettingsPopover } from "./settings-popover";

export async function Header() {
    const session = await auth.api.getSession({ headers: await headers() });

    return (
        <header className="border-b bg-muted-foreground/8 h-18 dark:shadow-[0_2px_6px_black]">
            <div className="mx-auto max-w-7xl h-full flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                    <Image className="size-7 dark:invert" src="/HearMeOut_Logo.svg" alt="HearMeOut logo" width={32} height={32} priority />
                    <h1 className="font-black text-2xl">HearMeOut</h1>
                </div>
                <div className="h-full flex items-center gap-2">
                    {session && <ShareDialog />}
                    <SettingsPopover />
                    {session && <UserPopover />}
                </div>
            </div>
        </header>
    );
}
