import { Pacifico } from 'next/font/google';
import React from 'react';

import { mergeClassnames } from '@/components/core/private/utils';

const Firework = ({ className }: { className?: string }) => (
  <div
    className={mergeClassnames(
      'border-2 border-solid border-white absolute opacity-0 animate-show-firework',
      className && className,
    )}
  >
    <span
      className={mergeClassnames(
        'absolute left-0 top-0 block h-[.375rem] w-[.375rem] opacity-0 rotate-0 animate-fire',
        'before:absolute before:top-[-3.75rem] before:left-0.5 before:w-0.5 before:block before:h-[3.125rem] before:bg-amber-75 before:content-[""]',
        'after:absolute after:bottom-[-3.75rem] after:left-0.5 after:w-0.5 after:block after:h-[3.125rem] after:bg-amber-75 after:content-[""]',
      )}
    >
      <i
        className={mergeClassnames(
          'before:absolute before:-top-4 before:left-[.625rem] before:block before:w-[3px] before:h-[3px] before:rounded-full before:bg-white before:content-[""]',
          'after:absolute after:-top-4 after:right-[.625rem] after:block after:w-[3px] after:h-h-[3px] before:rounded-full before:bg-white after:content-[""]',
        )}
      />
    </span>
    <span
      className={mergeClassnames(
        'absolute left-0 top-0 block h-[.375rem] w-[.375rem] opacity-0 rotate-120 animate-fire',
        'before:absolute before:top-[-3.75rem] before:left-0.5 before:w-0.5 before:block before:h-[3.125rem] before:bg-amber-75 before:content-[""]',
        'after:absolute after:bottom-[-3.75rem] after:left-0.5 after:w-0.5 after:block after:h-[3.125rem] after:bg-amber-75 after:content-[""]',
      )}
    >
      <i
        className={mergeClassnames(
          'before:absolute before:-top-4 before:left-[.625rem] before:block before:w-[3px] before:h-[3px] before:rounded-full before:bg-white before:content-[""]',
          'after:absolute after:-top-4 after:right-[.625rem] after:block after:w-[3px] after:h-h-[3px] before:rounded-full before:bg-white after:content-[""]',
        )}
      />
    </span>
    <span
      className={mergeClassnames(
        'absolute left-0 top-0 block h-[.375rem] w-[.375rem] opacity-0 rotate-240 animate-fire',
        'before:absolute before:top-[-3.75rem] before:left-0.5 before:w-0.5 before:block before:h-[3.125rem] before:bg-amber-75 before:content-[""]',
        'after:absolute after:bottom-[-3.75rem] after:left-0.5 after:w-0.5 after:block after:h-[3.125rem] after:bg-amber-75 after:content-[""]',
      )}
    >
      <i
        className={mergeClassnames(
          'before:absolute before:-top-4 before:left-[.625rem] before:block before:w-[3px] before:h-[3px] before:rounded-full before:bg-white before:content-[""]',
          'after:absolute after:-top-4 after:right-[.625rem] after:block after:w-[3px] after:h-h-[3px] before:rounded-full before:bg-white after:content-[""]',
        )}
      />
    </span>
  </div>
);

const pacifico = Pacifico({
  subsets: ['latin', 'vietnamese'],
  weight: ['400'],
});

const SpecialSection = () => {
  // const t = useTranslations('Index');

  return (
    <div
      className={mergeClassnames(
        'fixed left-0 top-0 z-[9999999] h-screen w-screen overflow-hidden bg-special-section-pattern',
        pacifico.className,
      )}
    >
      <div className="absolute top-1/3 w-full animate-display-message text-center text-[6.25rem] font-extrabold text-[#f48fb1] opacity-0 sm:top-1/2">
        Happy New Year
      </div>
      <div className="absolute left-0 top-0 flex size-full flex-row items-center justify-center overflow-hidden p-[12.5rem_6.25rem_0_0] text-[175px] font-bold text-white">
        <span>
          <span className="animate-change-to-secondary">2</span>
          <span className="animate-change-to-yellow">0</span>
          <span className="animate-change-to-orange">2</span>
        </span>
        <span className="absolute right-1/2 mr-[-12.5rem] animate-move-up-old-number">
          3
        </span>
        <span
          className={mergeClassnames(
            'absolute right-0 mr-[-12.5rem] animate-drop-new-number',
            'before:h-[.375rem] before:w-0 before:block before:rounded before:bg-white before:absolute before:top-[5rem] before:left-[.625] before:content-[""] before:z-[-1]',
            'before:rotate-0 before:origin-[left_top] before:animate-transform-from-old-to-new',
          )}
        >
          4
        </span>
        <div
          className={mergeClassnames(
            'absolute block right-0 top-1/2 mt-[-165px] mr-[-12.5rem] h-[6.25rem] w-[6.25rem] rounded-full bg-[#F04438] animate-float',
            'after:absolute after:bottom-[-6.875rem] after:left-1/2 after:-ml-0.5 after:block after:h-[6.25rem] after:w-1 after:rounded-[0_0_3px_3px] after:bg-white after:content-[""]',
            'before:absolute before:bottom-[-.625rem] before:left-1/2 before:ml-[-.625rem] before:h-0 before:w-0 before:border-solid before:border-[0px_10px_20px_10px] before:border-r-[#b19b32] before:content-[""] before:z-[-1]',
          )}
        />
      </div>
      <div className="absolute left-0 top-0 block size-full overflow-hidden">
        <Firework className="left-[20%] top-[40%]" />
        <Firework className="left-[15%] top-[70%]" />
        <Firework className="right-[20%] top-[40%]" />
        <Firework className="right-[15%] top-[70%]" />
      </div>
    </div>
  );
};

export default SpecialSection;
