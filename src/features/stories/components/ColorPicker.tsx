import type { ElementType } from 'react';
import { useRef } from 'react';

import { mergeClassnames } from '@/components/core/private/utils';
import {
  COVER_RAINBOW_CONIC,
} from '@/features/stories/constants';
import { resolveCoverColorSwatch } from '@/features/stories/utils/coverColorSwatch';

export type IColorPickerProps = {
  icon: ElementType;
  colors: readonly string[];
  value?: string;
  onChange: (color: string) => void;
  ariaLabel: string;
};

export const ColorPicker = ({
  icon: Icon,
  colors,
  value,
  onChange,
  ariaLabel,
}: IColorPickerProps) => {
  const colorInputRef = useRef<HTMLInputElement>(null);

  const selectedSwatch = resolveCoverColorSwatch(value, colors);

  const handleCustomColorClick = () => {
    colorInputRef.current?.click();
  };

  return (
    <div
      className="flex h-11 w-full items-center justify-center gap-6 rounded-full bg-white px-4 py-2"
      aria-label={ariaLabel}
    >
      <input
        ref={colorInputRef}
        type="color"
        className="sr-only"
        onChange={e => onChange(e.target.value)}
      />
      <div className="flex size-11 shrink-0 items-center justify-center p-3">
        <Icon size={20} weight="bold" className="text-neutral-20" />
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Custom color"
          onClick={handleCustomColorClick}
          className="size-7 shrink-0 rounded-full"
          style={{ background: COVER_RAINBOW_CONIC }}
        />
        {colors.map((color) => {
          const isSelected = selectedSwatch === color;

          return (
            <button
              key={color}
              type="button"
              aria-label={color}
              onClick={() => onChange(color)}
              className={mergeClassnames(
                'size-7 shrink-0 rounded-full transition',
                isSelected && 'ring-[6px] ring-neutral-80',
              )}
              style={{ background: color }}
            />
          );
        })}
      </div>
    </div>
  );
};
