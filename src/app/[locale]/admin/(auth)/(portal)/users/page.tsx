'use client';

import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import { useState } from 'react';

import { HuberCardListSkeleton } from '@/components/loadingState/Skeletons';
import IconButton from '@/components/core/iconButton/IconButton';
import Pagination from '@/components/core/pagination/Pagination';
import { HuberCard } from '@/components/hubers/HuberCard';
import { TopicChip } from '@/layouts/webapp/ChipFilter';
import type { Huber } from '@/libs/services/modules/huber/huberType';
import { useGetUsersQuery } from '@/libs/services/modules/user';
import { ROLE_NAME, Role } from '@/types/common';

export default function AdminUsersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [byRole, setByRole] = useState<Role>(Role.HUBER);
  const role = ROLE_NAME[byRole].toLowerCase();

  const { data: users, isLoading } = useGetUsersQuery({
    page: currentPage,
    limit: 12,
    role,
  });

  const list = users?.data ?? [];

  const handleRoleChange = (chip: Role) => {
    setByRole(chip);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-8 pt-0">
        <HuberCardListSkeleton />
      </div>
    );
  }

  if (list.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-5 p-8">
        <h1 className="text-[2.5rem] font-medium leading-tight">💕</h1>
        <p className="text-sm leading-5 text-neutral-20">You have a warm heart</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-8 pt-0">
      <div className="flex flex-col gap-2 pt-5">
        <h5 className="text-2xl font-medium leading-8 text-neutral-10">
          User management
        </h5>
        <p className="text-sm leading-5 text-neutral-20">List of Users</p>
      </div>
      <div className="scrollbar-hide flex w-full flex-nowrap items-center gap-2 overflow-x-auto py-2">
        {([Role.HUBER, Role.LIBER] as const).map(chip => (
          <TopicChip
            key={chip}
            isActive={byRole === chip}
            onClick={() => handleRoleChange(chip)}
          >
            {ROLE_NAME[chip]}
          </TopicChip>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {list.map((item: Partial<Huber>) => (
          <HuberCard
            key={item.id}
            {...item}
            awaiting={item.role?.id === Role.LIBER && item.approval === 'Pending'}
            showAdminControls
            isHuber={byRole === Role.HUBER}
          />
        ))}
      </div>
      {users?.meta && (
        <Pagination
          totalPages={users.meta.totalPages || 0}
          currentPage={users.meta.currentPage - 1 || 0}
          setCurrentPage={page => setCurrentPage(page + 1)}
        >
          <Pagination.PrevButton as="div">
            {({ disabled }) => (
              <IconButton
                icon={<ArrowLeft />}
                variant="ghost"
                size="lg"
                disabled={disabled}
                aria-label="Previous"
              />
            )}
          </Pagination.PrevButton>
          <Pagination.Pages as="button" type="button" />
          <Pagination.NextButton as="div">
            {({ disabled }) => (
              <IconButton
                icon={<ArrowRight />}
                variant="ghost"
                size="lg"
                disabled={disabled}
                aria-label="Next"
              />
            )}
          </Pagination.NextButton>
        </Pagination>
      )}
    </div>
  );
}
