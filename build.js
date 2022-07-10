const esbuild = require("esbuild");

const production = process.argv.findIndex((argItem) => argItem === "--mode=production") >= 0;

const onRebuild = (context) => {
  return async (err, res) => {
    if (err) {
      return console.error(`[${context}]: Rebuild failed`, err);
    }

    console.log(`[${context}]: Rebuild succeeded, warnings:`, res.warnings);
  };
};

const server = {
  entryPoints: [`server/server.ts`],
  outfile: `dist/server.js`,
  platform: "node",
  target: ["node16"],
  format: "cjs",
};

const client = {
  entryPoints: [`client/client.ts`],
  outfile: `dist/client.js`,
  platform: "browser",
  target: ["chrome93"],
  format: "iife",
};

const nui = {
  ...client,
  entryPoints: [`nui/nui.ts`],
  outfile: `dist/nui.js`,
};

for (const context of [server, client, nui]) {
  esbuild
    .build({
      ...context,
      bundle: true,
      watch: production
        ? false
        : {
            onRebuild: onRebuild(context),
          },
    })
    .then(() => console.log(`[${context.outfile}]: Built successfully!`))
    .catch(() => process.exit(1));
}
