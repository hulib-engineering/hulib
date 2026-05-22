'use client';

import type { ReactNode } from 'react';

import { mergeClassnames } from '@/components/core/private/utils';

type FooterProps = {
  children?: ReactNode;
  className?: string;
};

const Footer = ({
  children,
  className,
}: FooterProps) => (
  <div
    className={mergeClassnames(
      'sticky bottom-0 z-10',
      className,
    )}
  >
    {children}
  </div>
);

export default Footer;
