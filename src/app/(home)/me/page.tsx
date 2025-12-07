import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CollectionView } from "@/components/collection-view";
import { ContentSelectors } from "@/components/content-selectors";
import { auth } from "@/lib/auth";

export default async function Page() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect("/");

    return (
        <main className="space-y-4 max-w-7xl mx-auto p-4">
            <ContentSelectors />
            <section className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(185px,1fr))]">
                <CollectionView />
            </section>
        </main>
    );
}
