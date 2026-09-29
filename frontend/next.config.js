const { withSentryConfig } = require('@sentry/nextjs/config');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { instrumentationHook: true },
};

module.exports = withSentryConfig(nextConfig, {
  silent: true,
  org: process.env.SENTRY_ORG || 'quimicorp',
  project: process.env.SENTRY_PROJECT || 'quimicorp-backend',
  widenClientFileUpload: true,
  hideSourceMaps: true,
});
