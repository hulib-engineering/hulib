import Link from 'next/link';
import type { ReactNode } from 'react';
import React from 'react';

import { mergeClassnames } from '@/components/core/private/utils';

export const customMessage = (font: string): (() => ReactNode) => {
  return (...chunks: ReactNode[]): ReactNode => {
    return <span className={font}>{chunks}</span>;
  };
};

export const newLineMessage = (): (() => ReactNode) => {
  return (): ReactNode => {
    return <br />;
  };
};

export const highlightMessage = (
  isOutstanding: boolean,
  textColor: string,
): (() => ReactNode) => {
  return (...chunks: ReactNode[]): ReactNode => {
    return (
      <span
        className={mergeClassnames(
          textColor === 'primary' ? 'text-lp-primary-blue' : 'text-secondary',
          isOutstanding && 'text-[5.625rem]',
        )}
      >
        {chunks}
      </span>
    );
  };
};

export const unorderedMessageList = (listStyle: string): (() => ReactNode) => {
  return (...chunks: ReactNode[]): ReactNode => {
    return <ul className={listStyle}>{chunks}</ul>;
  };
};

export const listMessageItem = (): (() => ReactNode) => {
  return (...chunks: ReactNode[]): ReactNode => {
    return <li>{chunks}</li>;
  };
};

export const customInternalLink = (href: string): (() => ReactNode) => {
  return (...chunks: ReactNode[]): ReactNode => {
    return (
      <Link href={href} className="text-lp-primary-blue">
        {chunks}
      </Link>
    );
  };
};

export const customExternalLink = (href: string): (() => ReactNode) => {
  return (...chunks: ReactNode[]): ReactNode => {
    return (
      <Link
        href={href}
        className="text-lp-primary-blue"
        target="_blank"
        rel="noreferrer"
      >
        {chunks}
      </Link>
    );
  };
};

export const strongMessage = (): (() => ReactNode) => {
  return (...chunks: ReactNode[]): ReactNode => {
    return <strong>{chunks}</strong>;
  };
};

export const italicMessage = (): (() => ReactNode) => {
  return (...chunks: ReactNode[]): ReactNode => {
    return <i>{chunks}</i>;
  };
};
