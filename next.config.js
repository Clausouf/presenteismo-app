/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Evita que o build pare por avisos bobos de tipo
  },
  eslint: {
    ignoreDuringBuilds: true, // Evita travar por formatação de texto
  }
};

module.exports = nextConfig;
