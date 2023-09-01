/* eslint-disable @typescript-eslint/no-var-requires */
const esbuild = require("esbuild");

esbuild
  .build({
    entryPoints: ["./src/functions/index.ts"],
    bundle: true,
    minify: true,
    target: "node16",
    logLevel: "info",
    platform: "node",
    outfile: "./dist/functions/index.js",
  })
  .catch(() => process.exit(1));
