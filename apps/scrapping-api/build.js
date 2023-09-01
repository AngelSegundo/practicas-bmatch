const esbuild = require("esbuild");
const { esbuildPluginNodeExternals} = require("esbuild-plugin-node-externals");

esbuild
  .build({
    entryPoints: ["./src/index.ts"],
    bundle: true,
    minify: true,
    target: "ES2019",
    logLevel: "info",
    platform: "node",
    outfile: "./dist/index.js",
    plugins: [
      esbuildPluginNodeExternals({
        include: ["domain"]
      }),
    ],
  })
  .catch(() => process.exit(1));
