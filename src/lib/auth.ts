import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import type { ExtendedProfile } from "@/lib/types";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    experimental: { joins: true },
    user: {
        additionalFields: {
            country: { type: "string" },
            url: { type: "string" },
            uri: { type: "string" },
            followers: { type: "number" },
            product: { type: "string" },
        },
    },
    socialProviders: {
        spotify: {
            clientId: process.env.SPOTIFY_CLIENT_ID as string,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
            disableDefaultScope: true,
            scope: ["user-top-read", "user-read-email", "user-read-private"],
            overrideUserInfoOnSignIn: true,
            mapProfileToUser: (profile) => {
                const extendedProfile = profile as ExtendedProfile;
                return {
                    country: extendedProfile.country,
                    url: extendedProfile.external_urls.spotify,
                    uri: extendedProfile.uri,
                    followers: extendedProfile.followers.total,
                    product: extendedProfile.product,
                };
            },
        },
    },
});
