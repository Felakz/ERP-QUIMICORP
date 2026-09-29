import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  enabled: !!process.env.SENTRY_DSN,
  environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'development',
  release: process.env.SENTRY_RELEASE || process.env.RAILWAY_GIT_COMMIT_SHA,
  tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE || '1'),
  beforeSend(event) {
    if (event.request) { delete event.request.data; delete event.request.cookies; delete event.request.headers; delete event.request.query_string; }
    if (event.user) event.user = { id: event.user.id };
    return event;
  },
});
