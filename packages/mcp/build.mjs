/**
 * Bundles the server into one file.
 *
 * The indexer ships as TypeScript with extensionless imports, which Node's ESM
 * resolver cannot follow, so a plain `tsc` build produces something that only
 * runs under a loader. Bundling resolves all of that at build time and leaves a
 * single file that `npx oneagent-mcp` can execute directly.
 */
import { build } from "esbuild";

await build({
  entryPoints: ["src/index.ts"],
  outfile: "dist/index.cjs",
  bundle: true,
  platform: "node",
  target: "node20",
  // CJS, not ESM: stellar-sdk pulls in axios and friends, which call require()
  // at load time. Bundled as ESM those calls have nothing to resolve against.
  format: "cjs",

  banner: { js: "#!/usr/bin/env node" },
  logLevel: "info",
});
