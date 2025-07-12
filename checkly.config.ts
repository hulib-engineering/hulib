import { defineConfig } from 'checkly';
import { EmailAlertChannel, Frequency } from 'checkly/constructs';

const sendDefaults = {
  sendFailure: true,
  sendRecovery: true,
  sendDegraded: true,
};

// FIXME: Add your production URL
const productionURL = 'https://example.com';

const emailChannel = new EmailAlertChannel('email-channel', {
  // FIXME: add your own email address, Checkly will send you an email notification if a check fails
  address: 'hulibvietnam@gmail.com',
  ...sendDefaults,
});

export const config = defineConfig({
  projectName: 'Human Library',
  logicalId: 'human-library',
  repoUrl: 'https://github.com/HumanLibrary/hulib.git',
  checks: {
    frequency: Frequency.EVERY_24H,
    locations: ['us-east-1'],
    tags: ['website'],
    runtimeId: '2025.07',
    browserChecks: {
      frequency: Frequency.EVERY_24H,
      testMatch: '**/tests/e2e/**/*.check.spec.ts',
      alertChannels: [emailChannel],
    },
    playwrightConfig: {
      use: {
        baseURL: process.env.NEXT_PUBLIC_APP_URL || productionURL,
        extraHTTPHeaders: {
          'x-vercel-protection-bypass': process.env.VERCEL_BYPASS_TOKEN,
        },
      },
    },
  },
  cli: {
    runLocation: 'us-east-1',
    reporters: ['list'],
  },
});

export default config;
