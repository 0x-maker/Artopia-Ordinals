// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const withRemoveImports = require('next-remove-imports')();

const path = require('path');

const baseSecurityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin',
  },
];

/** @type {import('next').NextConfig} */
module.exports = withRemoveImports(
  withBundleAnalyzer({
    reactStrictMode: true,
    swcMinify: true,
    output: 'standalone',
    headers() {
      return [
        {
          source: '/:path*',
          headers: [
            {
              key: 'Content-Security-Policy',
              value: `frame-ancestors 'self' http://localhost:3000 https://devnet.generative.xyz https://testnet.generative.xyz https://generative.xyz https://ordinals.com https://dev-v5.generativeexplorer.com https://ordinals-explorer.generative.xyz https://cdn.generative.xyz https://preview.generativeexplorer.com https://storage.googleapis.com; frame-src 'self' http://localhost:3000 https://devnet.generative.xyz https://testnet.generative.xyz https://generative.xyz https://ordinals.com https://dev-v5.generativeexplorer.com https://ordinals-explorer.generative.xyz/ https://cdn.generative.xyz https://preview.generativeexplorer.com https://storage.googleapis.com;`,
            },
            ...baseSecurityHeaders,
          ],
        },
        {
          source: '/sw.js',
          headers: [
            {
              key: 'service-worker-allowed',
              value: '/',
            },
          ],
        },
        {
          source: '/caching.sw.js',
          headers: [
            {
              key: 'service-worker-allowed',
              value: '/',
            },
          ],
        },
        {
          source: '/sandbox/preview.html',
          headers: [
            {
              key: 'Content-Security-Policy',
              value: `frame-ancestors 'self' http://localhost:3000 https://devnet.generative.xyz https://testnet.generative.xyz https://generative.xyz https://ordinals.com https://dev-v5.generativeexplorer.com https://ordinals-explorer.generative.xyz https://cdn.generative.xyz https://preview.generativeexplorer.com https://storage.googleapis.com; frame-src 'self' http://localhost:3000 https://devnet.generative.xyz https://testnet.generative.xyz https://generative.xyz https://ordinals.com https://dev-v5.generativeexplorer.com https://ordinals-explorer.generative.xyz/ https://cdn.generative.xyz https://preview.generativeexplorer.com https://storage.googleapis.com;`,
            },
            {
              key: 'Cross-Origin-Embedder-Policy',
              value: 'require-corp',
            },
          ],
        },
      ];
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'ipfs.io',
        },
        {
          protocol: 'https',
          hostname: 'cloudflare-ipfs.com',
        },

        {
          protocol: 'https',
          hostname: 'storage.googleapis.com',
        },
        {
          protocol: 'https',
          hostname: '**.generative.xyz',
        },
      ],
    },
    sassOptions: {
      includePaths: [path.join(__dirname, 'styles')],
      prependData: `@import "@styles/_variables.scss";
      @import "@styles/_themes/_mixins.scss";
      @import "@styles/_themes/_variables.scss";
    `,
    },
    async redirects() {
      return [
        {
          source: '/create',
          destination: '/create/upload-project',
          permanent: true,
        },
      ];
    },
    rewrites: async () => [
      {
        source: "/sandbox/:path*",
        destination: "/sandbox/preview.html",
      },
    ],
  })
);
