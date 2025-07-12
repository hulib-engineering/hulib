// @ts-ignore
import type { LocalePrefixMode } from 'next-intl/routing';

import { Env } from '@/libs/Env.mjs';

const localePrefix: LocalePrefixMode = 'as-needed';

// FIXME: Update this configuration file based on your project information
export const AppConfig = {
  name: 'Human Library',
  locales: ['en', 'vi'],
  defaultLocale: 'vi',
  localePrefix,
  api: {
    version: Env.NEXT_PUBLIC_REACT_APP_BACKEND_VERSION,
    endpoint: Env.NEXT_PUBLIC_REACT_APP_BACKEND_ENDPOINT,
  },
};
