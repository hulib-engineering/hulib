import type { StorybookConfig } from '@storybook/nextjs';
import webpack from 'webpack';

process.env.NEXT_PUBLIC_REACT_APP_BACKEND_VERSION = process.env.NEXT_PUBLIC_REACT_APP_BACKEND_VERSION ?? 'v1';
process.env.NEXT_PUBLIC_REACT_APP_BACKEND_ENDPOINT = process.env.NEXT_PUBLIC_REACT_APP_BACKEND_ENDPOINT ?? 'http://localhost:3001';
process.env.NEXT_PUBLIC_REACT_APP_BACKEND_SOCKET_ENDPOINT = process.env.NEXT_PUBLIC_REACT_APP_BACKEND_SOCKET_ENDPOINT ?? 'http://localhost:3001';
process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? 'mock';
process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? 'mock';
process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? 'mock';
process.env.NEXT_PUBLIC_CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'mock@example.com';
process.env.NEXT_PUBLIC_CONTACT_PHONE_NUMBER = process.env.NEXT_PUBLIC_CONTACT_PHONE_NUMBER ?? '1234567890';
process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? 'mockcl0ud9';
process.env.NEXT_PUBLIC_UPLOAD_PRESET = process.env.NEXT_PUBLIC_UPLOAD_PRESET ?? 'mockpr3set9';
process.env.NEXT_PUBLIC_AGORA_APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID ?? 'mock';
process.env.NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  staticDirs: ['../public'],
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
  webpackFinal: async (config) => {
    config.plugins?.push(
      new webpack.DefinePlugin({
        'process.env.NEXT_PUBLIC_REACT_APP_BACKEND_VERSION': JSON.stringify(process.env.NEXT_PUBLIC_REACT_APP_BACKEND_VERSION),
        'process.env.NEXT_PUBLIC_REACT_APP_BACKEND_ENDPOINT': JSON.stringify(process.env.NEXT_PUBLIC_REACT_APP_BACKEND_ENDPOINT),
        'process.env.NEXT_PUBLIC_REACT_APP_BACKEND_SOCKET_ENDPOINT': JSON.stringify(process.env.NEXT_PUBLIC_REACT_APP_BACKEND_SOCKET_ENDPOINT),
        'process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID': JSON.stringify(process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID),
        'process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID': JSON.stringify(process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID),
        'process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY': JSON.stringify(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY),
        'process.env.NEXT_PUBLIC_CONTACT_EMAIL': JSON.stringify(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
        'process.env.NEXT_PUBLIC_CONTACT_PHONE_NUMBER': JSON.stringify(process.env.NEXT_PUBLIC_CONTACT_PHONE_NUMBER),
        'process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME': JSON.stringify(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME),
        'process.env.NEXT_PUBLIC_UPLOAD_PRESET': JSON.stringify(process.env.NEXT_PUBLIC_UPLOAD_PRESET),
        'process.env.NEXT_PUBLIC_AGORA_APP_ID': JSON.stringify(process.env.NEXT_PUBLIC_AGORA_APP_ID),
        'process.env.NEXT_PUBLIC_APP_URL': JSON.stringify(process.env.NEXT_PUBLIC_APP_URL),
      }),
    );
    return config;
  },
};

export default config;
