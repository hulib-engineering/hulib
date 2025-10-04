import Image from 'next/image';

import { mergeClassnames } from '@/components/core/private/utils';

const ratingImages = [
  '/assets/images/after-meeting/rate-1.png',
  '/assets/images/after-meeting/rate-2.png',
  '/assets/images/after-meeting/rate-3.png',
  '/assets/images/after-meeting/rate-4.png',
  '/assets/images/after-meeting/rate-5.png',
];

type IEmojiRateScaleProps = {
  lowestRateText?: string;
  highestRateText?: string;
  value: number;
  onChange: (rating: number) => void;
};

const EmojiRateScale = ({
  lowestRateText = 'Not good',
  highestRateText = 'Very good',
  value,
  onChange,
}: IEmojiRateScaleProps) =>
  (
    <div className="flex justify-between overflow-x-auto xl:justify-center xl:gap-11 xl:overflow-x-visible">
      {ratingImages.map((image, index) => (
        <div className="flex min-w-fit flex-col items-center gap-2" key={index}>
          {/* Rating button with enhanced touch interaction */}
          <button
            className={mergeClassnames(
              'border-8 rounded-full transition-all duration-200',
              'hover:transform-none xl:hover:scale-110',
              value === index
                ? 'border-primary-50 bg-primary-50 text-white hover:bg-primary-50 active:bg-primary-50 xl:hover:bg-primary-50'
                : 'border-transparent bg-transparent hover:bg-[rgba(4_66_191_0.08)] xl:hover:bg-transparent',
            )}
            onClick={() => onChange(index)}
          >
            <Image
              src={image}
              alt={`Rating ${index + 1}`}
              width={32}
              height={32}
              className="size-8 object-contain"
            />
          </button>

          {index === 0 && (
            <span className="hidden text-xs font-medium text-primary-60 xl:block">
              {lowestRateText}
            </span>
          )}
          {index === 4 && (
            <span className="hidden text-xs font-medium text-primary-60 xl:block">
              {highestRateText}
            </span>
          )}
        </div>
      ))}
    </div>
  );

export { EmojiRateScale };
