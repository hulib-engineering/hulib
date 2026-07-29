import type { ReactNode } from 'react';
import { mergeClassnames } from '@/components/core/private/utils';

type SessionsProps = {
  title?: string;
  children: ReactNode;
  row?: boolean;
  contentGap?: number;
};

export default function Sessions({ title, children, row, contentGap = 2 }: SessionsProps) {
  return (
    <div className={mergeClassnames('w-full flex flex-col', title && 'gap-3')}>
      <div className="text-sm font-medium leading-4 text-neutral-50">
        {title}
      </div>

      <div className={mergeClassnames('flex', `gap-${contentGap}`, row ? 'flex-row' : 'flex-col')}>
        {children}
      </div>
    </div>
  );
}
