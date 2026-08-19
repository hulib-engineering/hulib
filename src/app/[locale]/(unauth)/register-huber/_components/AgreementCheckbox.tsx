'use client';

import { useTranslations } from 'next-intl';

type AgreementCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export default function AgreementCheckbox({ checked, onChange }: AgreementCheckboxProps) {
  const t = useTranslations('Huber');
  return (
    <div className="rounded-[8px] border border-gray-200 bg-[#F0F5FF] px-5 py-4">
      <div
        className="flex cursor-pointer items-start gap-3"
        onClick={() => onChange(!checked)}
        role="presentation"
      >
        {/* 1. Checkbox */}
        <div className="relative mt-0.5 shrink-0">
          <input
            id="agreement-checkbox"
            type="checkbox"
            checked={checked}
            onChange={e => onChange(e.target.checked)}
            aria-label={t('agreement')}
            className="sr-only"
          />
          <div
            className={`flex size-5 items-center justify-center rounded border-2 transition-colors
              ${checked ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300 bg-white'}`}
          >
            {checked && (
              <svg className="size-3 text-white" fill="none" viewBox="0 0 10 8" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M1 4l2.5 2.5L9 1" />
              </svg>
            )}
          </div>
        </div>
        <div className="leading-4">
          {/* 2.1 Upper text */}
          <p className="text-[14px] font-medium text-[#171819] sm:text-[16px]">
            {t('agreement')}
          </p>
          {/* 2.2 Lower text */}
          <p className="mt-2.5 text-[12px] font-[300] text-[#171819] sm:text-[14px]">
            {t('huber_responsibility')}
          </p>
        </div>
      </div>
    </div>
  );
}
