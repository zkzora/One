import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Chain reads are slow and change slowly. Cache Components lets us mark those
  // reads with `use cache` + `cacheLife` instead of blocking every render.
  cacheComponents: true,
  // The indexer is a workspace package shipped as TypeScript source, so Next
  // has to compile it rather than expecting prebuilt JavaScript.
  transpilePackages: ["@one/indexer"],
};

export default nextConfig;
