/* eslint-disable @typescript-eslint/no-var-requires */
const esbuild = require("esbuild");

esbuild
  .build({
    entryPoints: ["./src/job.ts"],
    bundle: true,
    minify: true,
    target: "node16",
    logLevel: "info",
    platform: "node",
    outfile: "./dist/job.js",
  })
  .catch(() => process.exit(1));
