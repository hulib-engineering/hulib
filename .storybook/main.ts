import type { StorybookConfig } from '@storybook/nextjs';

process.env.NEXT_PUBLIC_REACT_APP_BACKEND_VERSION = process.env.NEXT_PUBLIC_REACT_APP_BACKEND_VERSION ?? 'v1';
process.env.NEXT_PUBLIC_REACT_APP_BACKEND_ENDPOINT = process.env.NEXT_PUBLIC_REACT_APP_BACKEND_ENDPOINT ?? 'http://localhost:3001';
process.env.NEXT_PUBLIC_REACT_APP_BACKEND_SOCKET_ENDPOINT = process.env.NEXT_PUBLIC_REACT_APP_BACKEND_SOCKET_ENDPOINT ?? 'http://localhost:3001';
process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? 'mock';
process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? 'mock';
process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? 'mock';
process.env.NEXT_PUBLIC_CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'mock@example.com';
process.env.NEXT_PUBLIC_CONTACT_PHONE_NUMBER = process.env.NEXT_PUBLIC_CONTACT_PHONE_NUMBER ?? '1234567890';
process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? 'mock-cloud-name';
process.env.NEXT_PUBLIC_UPLOAD_PRESET = process.env.NEXT_PUBLIC_UPLOAD_PRESET ?? 'mock-upload-preset';
process.env.NEXT_PUBLIC_AGORA_APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID ?? 'mock';
process.env.NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: { builder: { useSWC: true } },
  },
  docs: {
    autodocs: 'tag',
  },
  core: {
    disableTelemetry: true,
  },
};

export default config;
