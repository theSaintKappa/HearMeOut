import { ExternalLink } from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function CollectionInfoBanner({ userId }: { userId: string }) {
    const owner = await prisma.user.findUnique({ where: { id: userId }, select: { name: true, image: true, uri: true, sharedStats: { select: { updatedAt: true } } } });
    if (!owner) return null;

    const session = await auth.api.getSession({ headers: await headers() });

    return (
        <Item variant="outline">
            <ItemContent>
                <ItemTitle>
                    <h2 className="font-bold flex items-center gap-2">
                        Viewing
                        <a className="inline-flex items-center gap-1 text-primary hover:underline underline-offset-2" href={owner?.uri}>
                            {owner?.image && <Image src={owner.image} alt={`${owner.name}'s profile picture`} width={16} height={16} className="inline-block rounded-full h-lh w-auto" />}
                            <span>{owner.name}'s</span>
                        </a>
                        stats
                    </h2>
                </ItemTitle>
                {owner.sharedStats && <ItemDescription>Last updated: {new Date(owner.sharedStats.updatedAt).toLocaleString(undefined, { dateStyle: "long", timeStyle: "short" })}</ItemDescription>}
            </ItemContent>
            <ItemActions>
                {session ? (
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/me">
                            Go to My Stats <ExternalLink />
                        </Link>
                    </Button>
                ) : (
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/">
                            View Your Own Stats <ExternalLink />
                        </Link>
                    </Button>
                )}
            </ItemActions>
        </Item>
    );
}
