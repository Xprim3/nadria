import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = path.dirname(fileURLToPath(import.meta.url));

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : null;

/** Dev only: extra hostnames/IPs allowed for HMR when not using localhost (comma-separated). Defaults to your LAN IP if unset. */
const fromEnv =
  process.env.NEXT_DEV_ALLOWED_ORIGINS?.split(/[\s,]+/)
    .map((h) => h.trim())
    .filter(Boolean) ?? [];
const devAllowedOrigins =
  fromEnv.length > 0 ? fromEnv : ["192.168.2.130"];

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  // Lets phones / other machines on the LAN use dev + hot reload (see allowedDevOrigins in Next.js docs)
  ...(process.env.NODE_ENV === "development"
    ? { allowedDevOrigins: devAllowedOrigins }
    : {}),
  // Prefer this project when a parent directory also has a lockfile
  turbopack: {
    root: appRoot,
  },
  async redirects() {
    return [
      { source: "/impressum", destination: "/imprint", permanent: true },
      { source: "/datenschutz", destination: "/privacy", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      ...(supabaseHost
        ? [
            {
              protocol: "https" as const,
              hostname: supabaseHost,
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
