import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
      remotePatterns: [new URL('https://royalresorts.mobi/**'), new URL('http://localhost/**'), new URL('https://www.royalresorts.com/**'),
        {
          protocol: 'https',
          hostname: 'lh3.googleusercontent.com',
          port: '',
          pathname: '/**',
        }
      ],
  }
};

export default nextConfig;
