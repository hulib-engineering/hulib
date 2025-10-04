import { mergeClassnames } from '@/components/core/private/utils';

const pixelMap = [
  ['', '', 'pink', 'pink', 'pink', '', '', '', 'pink', 'pink', 'pink', '', ''],
  ['', 'pink', 'soft-pink', 'soft-pink', 'soft-pink', 'pink', '', 'pink', 'soft-pink', 'soft-pink', 'soft-pink', 'pink', ''],
  ['pink', 'soft-pink', 'soft-pink', 'white', 'white', 'soft-pink', 'pink', 'soft-pink', 'soft-pink', 'white', 'white', 'soft-pink', 'pink'],
  ['pink', 'soft-pink', 'white', 'white', 'white', 'white', 'soft-pink', 'white', 'white', 'white', 'white', 'soft-pink', 'pink'],
  ['pink', 'soft-pink', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'soft-pink', 'pink'],
  ['', 'pink', 'soft-pink', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'soft-pink', 'pink', ''],
  ['', '', 'pink', 'soft-pink', 'white', 'white', 'white', 'white', 'white', 'soft-pink', 'pink', '', ''],
  ['', '', '', 'pink', 'soft-pink', 'white', 'white', 'white', 'soft-pink', 'pink', '', '', ''],
  ['', '', '', '', 'pink', 'soft-pink', 'white', 'soft-pink', 'pink', '', '', '', ''],
  ['', '', '', '', '', 'pink', 'soft-pink', 'pink', '', '', '', '', ''],
  ['', '', '', '', '', '', 'pink', '', '', '', '', '', ''],
];

type IReactionAnimationProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const ReactionAnimation = ({ className, size = 'md' }: IReactionAnimationProps) => (
  <div className={mergeClassnames(
    'inline-grid animate-heartbeat gap-[1px] p-5',
    size === 'sm' ? 'grid-cols-heart-sm grid-rows-heart-sm' : 'grid-cols-heart grid-rows-heart',
    className,
  )}
  >
    {pixelMap.map((row, i) =>
      row.map((color, j) => (
        <div
          key={`${i}-${j}`}
          className={mergeClassnames(
            'transition-transform duration-300',
            size === 'sm' ? 'size-0.5' : 'size-5',
            color === 'pink'
              ? 'bg-red-60 animate-pink-pulse'
              : color === 'soft-pink'
                ? 'bg-red-80 animate-soft-pink-pulse'
                : color === 'white'
                  ? 'bg-red-98 animate-white-pulse'
                  : '',
          )}
        />
      )),
    )}
  </div>
);

export { ReactionAnimation };
