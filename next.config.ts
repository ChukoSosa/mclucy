import type { NextConfig } from "next";

const isDistBuild = process.env.BUILD_DIST_STANDALONE === "true";

const nextConfig: NextConfig = isDistBuild
	? {
			output: "standalone",
		}
	: {};

export default nextConfig;
