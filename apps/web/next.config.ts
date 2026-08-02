import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Chain reads are slow and change slowly. Cache Components lets us mark those
  // reads with `use cache` + `cacheLife` instead of blocking every render.
  cacheComponents: true,
  // The indexer is a workspace package shipped as TypeScript source, so Next
  // has to compile it rather than expecting prebuilt JavaScript.
  transpilePackages: ["@one/indexer"],
  turbopack: {
    // The monorepo root, stated rather than inferred. Turbopack refuses to
    // resolve files outside its root, and it guesses the root by hunting for
    // lockfiles — a stray package-lock.json in a parent directory is enough to
    // send the guess elsewhere. The indexer lives two levels up from this app,
    // so a wrong guess breaks the build's ability to see it.
    root: path.join(path.dirname(fileURLToPath(import.meta.url)), "../.."),
  },
};

export default nextConfig;
