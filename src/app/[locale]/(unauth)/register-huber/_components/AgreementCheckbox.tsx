'use client';

type AgreementCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export default function AgreementCheckbox({ checked, onChange }: AgreementCheckboxProps) {
  return (
    <div className="mb-8 rounded-[8px] border border-gray-200 bg-[#F0F5FF] px-5 py-4">
      <div
        className="flex cursor-pointer items-start gap-3"
        onClick={() => onChange(!checked)}
        role="presentation"
      >
        <div className="relative mt-0.5 shrink-0">
          <input
            id="agreement-checkbox"
            type="checkbox"
            checked={checked}
            onChange={e => onChange(e.target.checked)}
            aria-label="Mình đã đọc và đồng ý với các nguyên tắc cộng đồng của Hulib"
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
        <div className="py-[8px]">
          <p className="text-[16px] font-[500] leading-[12px] text-[#171819]">
            Mình đã đọc và đồng ý với các nguyên tắc cộng đồng của Hulib
          </p>
          <p className="mt-[10px] text-[14px] font-[300] leading-[20px] text-[#171819]">
            Huber tự chịu trách nhiệm về tính trung thực của các thông tin cung cấp cho Hulib.
          </p>
        </div>
      </div>
    </div>
  );
}
