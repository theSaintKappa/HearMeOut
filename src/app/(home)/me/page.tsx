import { headers } from "next/headers";
import { redirect } from "next/navigation";
// import { SignOutButton } from "@/components/sign-out-button";
import { auth } from "@/lib/auth";

export default async function Page() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect("/");

    return (
        <div className="flex flex-col gap-2">
            <span>Logged in as {session.user.name}</span>
            {/* <span>Fetched artists: {items.artists.length}</span>
            <span>Fetched offset: {items.offset}</span>
            <span>Next offset: {items.nextOffset ?? "None"}</span>
            <span>Limit: {items.limit}</span>
            <span>Total artists: {items.total}</span> */}
            {/* <SignOutButton /> */}
        </div>
    );
}
