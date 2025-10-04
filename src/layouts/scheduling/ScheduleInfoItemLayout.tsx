import type { ReactNode } from 'react';
import type { WithChildren } from '@/components/core/private/types';
import { mergeClassnames } from '@/components/core/private/utils';

export const ScheduleInfoItemLayout = ({ icon, title, className, children }: WithChildren<{ icon: ReactNode; title: string; className?: string }>) => (
  <div className={mergeClassnames('flex flex-col gap-1', className)}>
    <div className="flex items-center text-sm text-black">
      {icon}
      <span className="ml-2">{title}</span>
    </div>
    {children}
  </div>
);
