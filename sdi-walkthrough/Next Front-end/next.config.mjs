// @ts-check
import bundleAnalyser from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyser({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {};

// export default nextConfig;

export default withBundleAnalyzer(nextConfig);
