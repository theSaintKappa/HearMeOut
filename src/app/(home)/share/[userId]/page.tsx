import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ContentFilters } from "@/app/(home)/content-filters";
import { auth } from "@/lib/auth";
import { CollectionInfoBanner } from "./collection-info-banner";
import { PublicCollectionWrapper } from "./public-collection-wrapper";

export default async function Page({ params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;

    const session = await auth.api.getSession({ headers: await headers() });
    if (session && session.user.id === userId) redirect("/me");

    return (
        <main className="max-w-7xl mx-auto sm:p-4 p-2 sm:space-y-4 space-y-3">
            <CollectionInfoBanner userId={userId} />
            <ContentFilters />
            <PublicCollectionWrapper userId={userId} />
        </main>
    );
}
