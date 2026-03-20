#!/usr/bin/env node

const { spawnSync } = require("node:child_process");

const shouldBuildDist = process.env.BUILD_DIST_ON_POSTBUILD === "true";

if (!shouldBuildDist) {
  console.log("[postbuild] Skipping dist packaging. Set BUILD_DIST_ON_POSTBUILD=true to enable.");
  process.exit(0);
}

const result = spawnSync(process.execPath, ["scripts/build-dist.js"], {
  stdio: "inherit",
  env: process.env,
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
