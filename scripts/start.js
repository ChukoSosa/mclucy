#!/usr/bin/env node

const { spawn } = require("node:child_process");

const nextCliPath = require.resolve("next/dist/bin/next");
const port = process.env.PORT || "3001";

const child = spawn(process.execPath, [nextCliPath, "start", "-p", port], {
  stdio: "inherit",
  env: process.env,
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
