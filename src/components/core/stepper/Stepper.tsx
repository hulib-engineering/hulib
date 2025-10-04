'use client';

import type { ReactNode } from 'react';
import { Children, useMemo } from 'react';
import { Check } from '@phosphor-icons/react';
import { StepperContext, useStepperContext } from './private/utils';
import { mergeClassnames } from '@/components/core/private/utils';

export const Stepper = ({
  activeStep,
  children,
  className,
}: {
  activeStep: number;
  children: ReactNode;
  className?: string;
}) => {
  const items = Children.toArray(children);
  const childrenWithConnectors = items.flatMap((child, index) => {
    if (index < items.length - 1) {
      return [child, <StepConnector key={`connector-${index}`} index={index} />];
    }
    return [child];
  });

  // ✅ Memoize context value so it doesn’t recreate every render
  const value = useMemo(() => ({ activeStep }), [activeStep]);

  return (
    <StepperContext.Provider value={value}>
      <div className={mergeClassnames('relative flex w-full items-center justify-between', className && className)}>
        {childrenWithConnectors}
      </div>
    </StepperContext.Provider>
  );
};

export const Step = ({
  index,
  children,
}: {
  index: number;
  children: ReactNode;
}) => {
  const { activeStep } = useStepperContext('Step');

  const isActive = activeStep === index;
  const isCompleted = activeStep > index;

  return (
    <div className={mergeClassnames('group relative flex w-8 flex-col items-center gap-2.5', (isActive || isCompleted) && 'active')}>
      <div
        className={mergeClassnames(
          'flex size-8 items-center justify-center rounded-full border-2 text-[13px] font-medium leading-none transition-colors',
          isActive ? 'border-primary-60 bg-white text-primary-60' : '',
          isCompleted ? 'border-none bg-primary-60 text-white' : '',
          !isActive && !isCompleted ? 'border-neutral-variant-80 bg-white text-neutral-80' : '',
        )}
      >
        {isCompleted ? <Check className="text-2xl" /> : (index + 1).toString().padStart(2, '0')}
      </div>

      {children}
    </div>
  );
};

export const StepLabel = ({ children }: { children: ReactNode }) => {
  return (
    <span className="whitespace-nowrap font-medium tracking-tight text-[#465668] group-[.active]:text-primary-60">
      {children}
    </span>
  );
};

export function StepConnector({ index }: { index: number }) {
  const { activeStep } = useStepperContext('StepConnector');

  const isCompleted = activeStep > index;

  return (
    <div
      className={mergeClassnames(
        '-mt-8 h-[2px] flex-1 transition-colors',
        isCompleted ? 'bg-primary-60' : 'bg-neutral-variant-80',
      )}
    />
  );
}
