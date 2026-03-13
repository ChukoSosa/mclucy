#!/usr/bin/env node

const { spawn } = require("child_process");

const nextCliPath = require.resolve("next/dist/bin/next");
const env = {
  ...process.env,
  MISSION_CONTROL_DEMO_MODE: "true",
  NEXT_PUBLIC_MISSION_CONTROL_DEMO_MODE: "true",
};

const child = spawn(process.execPath, [nextCliPath, "dev", "-p", "3001"], {
  stdio: "inherit",
  env,
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});