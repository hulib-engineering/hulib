// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
import * as Spotlight from '@spotlightjs/spotlight';

Sentry.init({
  // FIXME: Add your Sentry DSN
  dsn: 'https://16bc7f4e4d00a7cc86ec916d6b625518@o4506568698626048.ingest.sentry.io/4506568729100288',

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0.5,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  replaysOnErrorSampleRate: 0,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0,

  // You can remove this option if you're not planning to use the Sentry Session Replay feature:
  integrations: [
    new Sentry.Replay({
      // Additional Replay configuration goes in here, for example:
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});

if (process.env.NODE_ENV === 'development') {
  Spotlight.init();
}
