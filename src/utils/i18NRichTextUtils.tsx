import Link from 'next/link';
import type { ReactNode } from 'react';
import React from 'react';

import { mergeClassnames } from '@/components/private/utils';

export const customMessage = (font: string): (() => ReactNode) => {
  // eslint-disable-next-line react/display-name
  return (...chunks: ReactNode[]): ReactNode => {
    return <span className={font}>{chunks}</span>;
  };
};

export const newLineMessage = (): (() => ReactNode) => {
  // eslint-disable-next-line react/display-name
  return (): ReactNode => {
    return <br />;
  };
};

export const highlightMessage = (
  isOutstanding: boolean,
  textColor: string,
): (() => ReactNode) => {
  // eslint-disable-next-line react/display-name
  return (...chunks: ReactNode[]): ReactNode => {
    return (
      <span
        className={mergeClassnames(
          textColor === 'primary' ? 'text-primary-10' : 'text-secondary',
          isOutstanding && 'text-[5.625rem]',
        )}
      >
        {chunks}
      </span>
    );
  };
};

export const unorderedMessageList = (listStyle: string): (() => ReactNode) => {
  // eslint-disable-next-line react/display-name
  return (...chunks: ReactNode[]): ReactNode => {
    return <ul className={listStyle}>{chunks}</ul>;
  };
};

export const listMessageItem = (): (() => ReactNode) => {
  // eslint-disable-next-line react/display-name
  return (...chunks: ReactNode[]): ReactNode => {
    return <li>{chunks}</li>;
  };
};

export const customInternalLink = (href: string): (() => ReactNode) => {
  // eslint-disable-next-line react/display-name
  return (...chunks: ReactNode[]): ReactNode => {
    return (
      <Link href={href} className="text-primary-10">
        {chunks}
      </Link>
    );
  };
};

export const customExternalLink = (href: string): (() => ReactNode) => {
  // eslint-disable-next-line react/display-name
  return (...chunks: ReactNode[]): ReactNode => {
    return (
      <Link
        href={href}
        className="text-primary-10"
        target="_blank"
        rel="noreferrer"
      >
        {chunks}
      </Link>
    );
  };
};
