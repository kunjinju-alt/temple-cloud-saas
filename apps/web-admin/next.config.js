/** @type {import("next").NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@temple-cloud/db",
    "@temple-cloud/shared",
    "@temple-cloud/pdf",
    "@temple-cloud/ui"
  ]
};

module.exports = nextConfig;