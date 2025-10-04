import { Books, Users } from '@phosphor-icons/react';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { mergeClassnames } from '@/components/core/private/utils';

// Badge component for showing counts
const CountBadge = ({ count }: { count: number }) => {
  if (!count) {
    return null;
  }
  return (
    <div className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-medium text-white">
      {count}
    </div>
  );
};

const adminNavItems = [
  {
    label: 'Awaiting approval stories',
    icon: Books,
    href: '/admin/stories/approval',
  },
  {
    label: 'User management',
    icon: Users,
    href: '/admin/users',
  },
];

const AdminLayout = ({
  children,
  className,
  pendingStoriesCount = 0,
  pendingUsersCount = 0,
}: {
  children: React.ReactNode;
  className?: string;
  pendingStoriesCount?: number;
  pendingUsersCount?: number;
}) => {
  const pathname = usePathname();

  return (
    <section className="w-full">
      <div
        className={clsx(
          `${
            className || ''
          } w-full justify-between rounded-md p-0 px-4 py-[-2rem] lg:flex-row `,
          'lg:px-28 lg:py-12',
        )}
      >
        <div className="rounded-lg bg-white shadow-md">
          <div className="flex">
            <div className="w-[320px] border-r px-2 py-4">
              <nav className="space-y-1">
                {adminNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname.includes(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={mergeClassnames(
                        'flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                        isActive
                          ? 'bg-primary-98 text-primary-50'
                          : 'text-neutral-40 hover:bg-neutral-95',
                      )}
                    >
                      <Icon size={20} weight={isActive ? 'fill' : 'regular'} />
                      <div className="flex items-center gap-2">
                        {item.label}
                        {item.label === 'Awaiting approval stories' && (
                          <CountBadge count={pendingStoriesCount || 0} />
                        )}
                        {item.label === 'User management' && (
                          <CountBadge count={pendingUsersCount || 0} />
                        )}
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex min-h-[600px] flex-1 items-center justify-center">
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminLayout;
