import React from 'react';

import { mergeClassnames } from '@/components/private/utils';

const LoaderItem = ({ order }: { order: number }) => (
  <div
    className={mergeClassnames(
      'animate-loader-circle-jump size-3 rounded-full bg-primary even:bg-primary-hover even:animation-delay-300',
      order % 3 === 0 && 'animation-delay-600',
    )}
  />
);

const Loader = () => (
  <div
    className={mergeClassnames(
      'relative flex gap-1',
      'before:absolute before:inset-0 before:h-8 before:w-full before:bg-primary before:bg-radial-gradient before:blur-2xl before:content-[""]',
    )}
  >
    {Array.from({ length: 5 }, (_, i) => i + 1).map((each, index) => (
      <LoaderItem key={index} order={each} />
    ))}
  </div>
);

export { Loader };
