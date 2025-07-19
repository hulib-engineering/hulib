'use client';

import clsx from 'clsx';
import React, { useEffect } from 'react';

import Button from '@/components/button/Button';
import UserCard from '@/features/users/components/UserCard';
import AdminLayout from '@/layouts/AdminLayout';
import { useGetUsersQuery } from '@/libs/services/modules/user';
import { ROLE_NAME, Role } from '@/types/common';

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
  const [selectedRole, setSelectedRole] = React.useState<Role>(Role.LIBER);

  const {
    data: users,
    isLoading,
    refetch,
  } = useGetUsersQuery({
    page: 1,
    limit: 50,
    role: ROLE_NAME[selectedRole].toLowerCase() || '',
  });

  const handleChangeRole = (role: Role) => {
    setSelectedRole(role);
  };

  useEffect(() => {
    refetch();
  }, [selectedRole]);

  if (isLoading) {
    return (
      <div className="col-span-full py-12 text-center text-lg text-neutral-40">
        Loading...
      </div>
    );
  }

  return (
    <AdminLayout pendingUsersCount={0}>
      <div className="mx-auto flex size-full flex-col md:p-8">
        {/* Header section */}
        <h1 className="mb-1 text-2xl font-bold">User management</h1>
        <p className="mb-6 text-base text-neutral-40">List of Users</p>
        {/* Segmented control for role filter */}
        <div className="mb-6 flex gap-2">
          {/* Huber badge */}
          <RoleBadge
            role={Role.LIBER}
            selectedRole={selectedRole}
            setSelectedRole={handleChangeRole}
          />
          <RoleBadge
            role={Role.HUBER}
            selectedRole={selectedRole}
            setSelectedRole={handleChangeRole}
          />
        </div>
        {/* User grid, filtered by selected role */}
        <div className="flex flex-1 flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {/* Filter users locally by selectedRole */}
            {users?.data?.map((user: any) => (
              <UserCard key={user.id} data={user} />
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UsersPage;
