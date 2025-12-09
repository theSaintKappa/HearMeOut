import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CollectionView } from "@/components/collection-view";
import { ContentFilters } from "@/components/content-filters";
import { auth } from "@/lib/auth";

export default async function Page() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect("/");

    return (
        <main className="max-w-7xl mx-auto sm:p-4 p-2 sm:space-y-4 space-y-3">
            <ContentFilters />
            <CollectionView />
        </main>
    );
}
