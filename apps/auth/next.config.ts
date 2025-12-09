import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactCompiler: true,
	output: "standalone",
	basePath: process.env.ENVIROMENT === "stage" ? "/auth" : "",
};

export default nextConfig;
