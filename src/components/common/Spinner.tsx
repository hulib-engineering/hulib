import React from 'react';
import { mergeClassnames } from '@/components/private/utils';

const Spinner = () => (
  <div
    className={mergeClassnames(
      'relative h-[50px] w-[230px] animate-rotate overflow-hidden rounded-lg shadow-spinner',
      'before:absolute before:inset-0 before:block before:h-full before:animate-load before:bg-primary-70 before:content-empty',
    )}
  >
  </div>
);

export { Spinner };
