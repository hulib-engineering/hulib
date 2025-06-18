'use client';

import clsx from 'clsx';
import React from 'react';

import Button from '@/components/button/Button';
import UserCard from '@/features/users/components/UserCard';
import AdminLayout from '@/layouts/AdminLayout';
import { useGetUsersQuery } from '@/libs/services/modules/user';
import { Role, ROLE_NAME } from '@/types/common';

const RoleBadge = ({
  role,
  selectedRole,
  setSelectedRole,
}: {
  role: Role;
  selectedRole: Role;
  setSelectedRole: (role: Role) => void;
}) => {
  return (
    <Button
      variant="outline"
      size="sm"
      className={clsx(
        'rounded-full',
        selectedRole === role
          ? 'border-primary-80 bg-primary-80 text-primary-60'
          : 'border-neutral-90 bg-neutral-90 text-neutral-20',
      )}
      onClick={() => setSelectedRole(role)}
      aria-pressed={selectedRole === role}
    >
      {ROLE_NAME[role]}
    </Button>
  );
};

const UsersPage = () => {
  // Local state for selected role filter (Huber or Liber)
  const [selectedRole, setSelectedRole] = React.useState<Role>(Role.HUBER);

  const { data: users, isLoading } = useGetUsersQuery({
    page: 1,
    limit: 12,
  });

  // Always call hooks at the top level, before any early returns
  const userList = React.useMemo(() => {
    // Filter by selected role
    let filtered =
      users?.data?.filter((user: any) => user.role?.id === selectedRole) || [];
    // If Huber, sort so approval 'Pending' comes first
    if (selectedRole === Role.HUBER) {
      filtered = filtered.slice().sort((a: any, b: any) => {
        // Place 'Pending' approval first
        if (a.approval === 'Pending' && b.approval !== 'Pending') return -1;
        if (a.approval !== 'Pending' && b.approval === 'Pending') return 1;
        return 0;
      });
    }
    return filtered;
  }, [users, selectedRole]);

  if (isLoading) {
    return (
      <div className="col-span-full py-12 text-center text-lg text-neutral-40">
        Loading...
      </div>
    );
  }

  return (
    <AdminLayout pendingUsersCount={0}>
      <div className="mx-auto flex h-full w-full flex-col md:p-8">
        {/* Header section */}
        <h1 className="mb-1 text-2xl font-bold">User management</h1>
        <p className="mb-6 text-base text-neutral-40">List of Users</p>
        {/* Segmented control for role filter */}
        <div className="mb-6 flex gap-2">
          {/* Huber badge */}
          <RoleBadge
            role={Role.HUBER}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
          />
          <RoleBadge
            role={Role.LIBER}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
          />
        </div>
        {/* User grid, filtered by selected role */}
        <div className="flex flex-1 flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {/* Filter users locally by selectedRole */}
            {userList.map((user: any) => (
              <UserCard key={user.id} data={user} />
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UsersPage;
