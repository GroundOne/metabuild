/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
    swcMinify: true,
    eslint: {
        dirs: ['pages', 'components', 'lib', 'utils'],
    },
}

module.exports = nextConfig
