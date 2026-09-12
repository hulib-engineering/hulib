import { mergeClassnames } from '@/components/core/private/utils';
import { ROLE_NAME, Role } from '@/types/common';

type RoleBadgeProps = {
  role: 'huber' | 'liber';
  rank?: number;
  className?: string;
  showLockIcon?: boolean;
};

export default function RoleBadge({ role, rank, className, showLockIcon = false }: RoleBadgeProps) {
  const isHuber = role === 'huber';

  return (
    <div
      className={mergeClassnames(
        'inline-flex items-center gap-1 rounded-[8px] w-fit ',
        isHuber
          ? 'bg-gradient-to-b from-[#B6E8F8] to-[#D1BDF9] p-2'
          : 'border border-yellow-70 bg-yellow-90 px-4 py-1',
        className,
      )}
    >
      <span
        className={mergeClassnames(
          'text-xs md:text-xl font-medium',
          isHuber ? 'text-primary-50' : 'text-orange-40',
        )}
      >

        {isHuber ? ROLE_NAME[Role.HUBER] : ROLE_NAME[Role.LIBER]}
        {' '}
        {showLockIcon && '🔒'}
      </span>
      {rank !== undefined && (
        <span className="rounded-[8px] border-2 border-white bg-red-50 px-1 py-px text-[10px] font-medium text-white">
          {rank}
        </span>
      )}
    </div>
  );
}
