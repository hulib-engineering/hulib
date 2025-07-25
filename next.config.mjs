import { withSentryConfig } from '@sentry/nextjs';

import './src/libs/Env.mjs';

import withBundleAnalyzer from '@next/bundle-analyzer';
import withNextIntl from 'next-intl/plugin';

const withNextIntlConfig = withNextIntl('./src/libs/i18n.ts');

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
export default withSentryConfig(
  bundleAnalyzer(
    withNextIntlConfig({
      eslint: {
        dirs: ['.'],
        ignoreDuringBuilds: true,
      },
      typescript: {
        ignoreBuildErrors: true,
      },
      poweredByHeader: false,
      reactStrictMode: true,
      transpilePackages: ['@wavesurfer/react'],
      experimental: {
        // Related to Pino error with RSC: https://github.com/orgs/vercel/discussions/3150
        serverComponentsExternalPackages: ['pino'],
        // Use Turbo if available
        turbo: true,
      },
      webpack: (config) => {
        // config.externals is needed to resolve the following errors:
        // Module not found: Can't resolve 'bufferutil'
        // Module not found: Can't resolve 'utf-8-validate'
        config.externals.push({
          'bufferutil': 'bufferutil',
          'utf-8-validate': 'utf-8-validate',
          '@headlessui/react': '@headlessui/react',
        });

        return config;
      },
      images: {
        domains: ['dev-hulib-staging.s3.ap-southeast-1.amazonaws.com'],
        remotePatterns: [
          {
            protocol: 'http',
            hostname: 'localhost',
            port: '3001',
            pathname: '/api/v1/files/**',
            search: '',
          },
          {
            protocol: 'https',
            hostname: 'hulib-services.onrender.com',
            pathname: '/api/v1/files/**',
            search: '',
          },
        ],
      },
    }),
  ),
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    // FIXME: Add your Sentry organization and project names
    org: 'human-library',
    project: 'fe',
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: '/monitoring',

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors.
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Disable Sentry telemetry
    telemetry: false,
  },
);
