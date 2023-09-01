/* eslint-disable @typescript-eslint/no-var-requires */
const esbuild = require("esbuild");
const { nodeExternals } = require("esbuild-plugin-node-externals");

esbuild
  .build({
    entryPoints: ["./src/index.ts"],
    bundle: true,
    minify: true,
    logLevel: "info",
    platform: "node",
    outfile: "./dist/job/index.js",
    plugins: [
      nodeExternals({
        include: ["domain"],
      }),
    ],
  })
  .catch(() => process.exit(1));
