import type { LocalePrefix } from 'next-intl/dist/types/src/shared/types';

const localePrefix: LocalePrefix = 'as-needed';

// FIXME: Update this configuration file based on your project information
export const AppConfig = {
  name: 'Human Library',
  locales: ['en', 'vi'],
  defaultLocale: 'en',
  localePrefix,
};
