import { Heart } from '@phosphor-icons/react';
import { useState } from 'react';
import { mergeClassnames } from '@/components/core/private/utils';

type IRatingProps = {
  value: number;
  onChange: (rating: number) => void;
  activeColor?: string;
  inactiveColor?: string;
};

const Rating = ({
  value,
  onChange,
  activeColor = 'yellow-60',
  inactiveColor = 'neutral-90',
}: IRatingProps) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  return (
    <div className="flex justify-center gap-4">
      {[...Array(5)].map((_, index) => {
        const isActive
            = hoverIndex !== null ? index <= hoverIndex : index < value;

        return (
          <button type="button" key={index} onClick={() => onChange(index + 1)}>
            <Heart
              weight="fill"
              className={mergeClassnames(
                'size-12 cursor-pointer transition-all duration-200',
                isActive ? `text-${activeColor}` : `text-${inactiveColor}`,
              )}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
            />
          </button>

        );
      },
      )}
    </div>
  );
};

export { Rating };
