/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ['*'],
  webpackDevMiddleware: (config) => {
    config.headers = {
      'Access-Control-Allow-Origin': '*',
    }
    return config
  },
}

export default nextConfig
