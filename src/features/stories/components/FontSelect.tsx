import { CaretDown } from '@phosphor-icons/react';

import { mergeClassnames } from '@/components/core/private/utils';
import Dropdown from '@/components/core/dropdown/Dropdown';
import MenuItem from '@/components/core/menuItem/MenuItem';
import type { CoverFontFamily } from '@/features/stories/types';
import {
  bellotaText,
  benchNine,
  caesarDressing,
  poppins,
  svnApple,
  svnRio,
} from '@/styles/fonts';

const COVER_FONT_OPTIONS = [
  { id: 'svn-rio', label: 'SVN-Rio 2016', className: svnRio.className },
  { id: 'poppins', label: 'SVN-Poppins', className: poppins.className },
  { id: 'caesar-dressing', label: 'Caesar Dressing', className: caesarDressing.className },
  { id: 'svn-apple', label: 'SVN-Apple', className: svnApple.className },
  { id: 'benchnine', label: 'BenchNine', className: benchNine.className },
  { id: 'bellota-text', label: 'Bellota Text', className: bellotaText.className },
];

type ICoverFontSelectProps = {
  value: CoverFontFamily;
  onChange: (fontFamily: CoverFontFamily) => void;
  ariaLabel: string;
};

export const FontSelect = ({ value, onChange, ariaLabel }: ICoverFontSelectProps) => {
  const selected = COVER_FONT_OPTIONS.find(option => option.id === value)
    ?? COVER_FONT_OPTIONS[0]!;

  return (
    <Dropdown
      value={value}
      onChange={v => onChange(v as CoverFontFamily)}
      className="min-w-0 flex-1"
    >
      {({ open }) => (
        <>
          <Dropdown.Trigger
            aria-label={ariaLabel}
            className="flex w-full min-w-0 items-center justify-between gap-2 rounded-full bg-white px-4 py-3 text-left"
          >
            <span
              className={mergeClassnames(
                'truncate text-base font-medium leading-5 text-neutral-10',
                selected.className,
              )}
            >
              {selected.label}
            </span>
            <CaretDown
              size={20}
              className={mergeClassnames(
                'shrink-0 text-neutral-10 transition-transform',
                open && 'rotate-180',
              )}
              aria-hidden
            />
          </Dropdown.Trigger>
          <Dropdown.Options>
            {COVER_FONT_OPTIONS.map(option => (
              <Dropdown.Option key={option.id} value={option.id}>
                {({ selected: isSelected, active }) => (
                  <MenuItem isActive={active} isSelected={isSelected}>
                    <MenuItem.Title
                      className={mergeClassnames(
                        'text-base font-medium leading-5 text-neutral-10',
                        option.className,
                        isSelected && 'text-primary-50',
                      )}
                    >
                      {option.label}
                    </MenuItem.Title>
                  </MenuItem>
                )}
              </Dropdown.Option>
            ))}
          </Dropdown.Options>
        </>
      )}
    </Dropdown>
  );
};
