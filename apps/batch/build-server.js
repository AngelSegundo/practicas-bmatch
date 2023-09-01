/* eslint-disable @typescript-eslint/no-var-requires */
const esbuild = require("esbuild");

esbuild
  .build({
    entryPoints: ["./src/server.ts"],
    bundle: true,
    minify: true,
    logLevel: "info",
    platform: "node",
    outfile: "./dist/server.js",
  })
  .catch(() => process.exit(1));
