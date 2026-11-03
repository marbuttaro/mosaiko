/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['127.0.0.1'],
  // Come WordPress: tutte le pagine finiscono con "/" (/partner/, /news/, /<articolo>/)
  trailingSlash: true,
}

export default nextConfig
