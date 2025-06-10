import { Books, Users } from '@phosphor-icons/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { mergeClassnames } from '@/components/private/utils';

// Badge component for showing counts
const CountBadge = ({ count }: { count: number }) => {
  if (!count) return null;
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

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <div className="rounded-lg bg-white shadow-md">
      <div className="flex">
        <div className="w-[320px] border-r px-2 py-4">
          <nav className="space-y-1">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
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
                    <CountBadge count={12} />
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
  );
};

export default AdminLayout;
