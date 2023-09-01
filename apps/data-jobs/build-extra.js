/* eslint-disable @typescript-eslint/no-var-requires */
const esbuild = require("esbuild");
const { nodeExternals } = require("esbuild-plugin-node-externals");

esbuild
  .build({
    entryPoints: ["./src/extra.ts"],
    bundle: true,
    minify: true,
    logLevel: "info",
    platform: "node",
    outfile: "./dist/job/extra.js",
    plugins: [
      nodeExternals({
        include: ["domain"],
      }),
    ],
  })
  .catch(() => process.exit(1));
