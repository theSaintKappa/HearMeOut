import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    allowedDevOrigins: ["http://127.0.0.1:3000/"],
    reactCompiler: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "i.scdn.co",
                pathname: "/image/**",
            },
        ],
    },
};

export default nextConfig;
