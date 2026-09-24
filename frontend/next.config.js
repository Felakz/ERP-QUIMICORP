const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = withSentryConfig(nextConfig, {
  silent: true,
  org: 'quimicorp',
  project: 'quimicorp-backed',
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
});
