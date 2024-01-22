// eslint-disable-next-line import/no-extraneous-dependencies
import { extendTailwindMerge } from 'tailwind-merge';

const mergeClassnames = extendTailwindMerge({
  cacheSize: 0,
});

export { mergeClassnames };
