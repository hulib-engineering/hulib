'use client';

import type { ReactNode } from 'react';
import { HomeTemplateInner } from './HomeTemplateInner';

export default function HomeTemplate({ children }: { children: ReactNode }) {
  return (
    <HomeTemplateInner>
      {children}
    </HomeTemplateInner>
  );
}
