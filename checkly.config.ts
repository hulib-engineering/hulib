/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'checkly';
import { EmailAlertChannel, Frequency } from 'checkly/constructs';

const emailChannel = new EmailAlertChannel('email-channel', {
  // FIXME: add your own email address, Checkly will send you an email notification if a check fails
  address: 'hulibvietnam@gmail.com',
  sendDegraded: true,
});

export const config = defineConfig({
  projectName: 'Human Library',
  logicalId: 'human-library',
  repoUrl: 'https://github.com/HumanLibrary/hulib.git',
  checks: {
    frequency: Frequency.EVERY_24H,
    locations: ['us-east-1'],
    tags: ['website'],
    runtimeId: '2024.01',
    environmentVariables: [
      {
        key: 'PRODUCTION_URL',
        // FIXME: Add your own production URL
        value: '',
      },
    ],
    browserChecks: {
      frequency: Frequency.EVERY_24H,
      testMatch: '**/tests/e2e/**/*.check.spec.ts',
      alertChannels: [emailChannel],
    },
  },
  cli: {
    runLocation: 'us-east-1',
    reporters: ['list'],
  },
});

export default config;
