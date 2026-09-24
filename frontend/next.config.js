let withSentryConfig = (c) => c;
try {
  const sentry = require('@sentry/nextjs');
  withSentryConfig = sentry.withSentryConfig || sentry.default?.withSentryConfig || withSentryConfig;
  if (typeof withSentryConfig !== 'function') {
    const alt = require('@sentry/nextjs/config');
    withSentryConfig = alt.withSentryConfig || withSentryConfig;
  }
} catch {}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = withSentryConfig(nextConfig, {
  silent: true,
  org: 'quimicorp',
  project: 'quimicorp-backend',
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
});
