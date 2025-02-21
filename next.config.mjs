/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    compress: true,
    productionBrowserSourceMaps: false,
    poweredByHeader: false,
    output: 'standalone', // Ensures compatibility with Docker deployments
};

export default nextConfig;
