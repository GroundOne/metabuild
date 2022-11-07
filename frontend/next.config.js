/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    eslint: {
        dirs: ['pages', 'components', 'lib', 'utils'],
    },
    images: {
        domains: ['images.squarespace-cdn.com'],
    },
};

module.exports = nextConfig;
