import { CaretCircleRight } from '@phosphor-icons/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import Button from '@/components/core/button/Button';
import { Role } from '@/types/common';

const UserCard = ({ data }: any) => {
  const router = useRouter();
  const t = useTranslations('ExploreStory');

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="relative size-[196px] overflow-hidden">
        {data.approval === 'Pending' && (
          <span className="absolute bottom-4 left-5 rounded-lg bg-orange-90 px-2 py-1 text-sm text-orange-50">
            Waiting for approval
          </span>
        )}
        <Image
          src={data.photo?.path ?? '/assets/images/huber/cover-huber.png'}
          alt={data.fullName}
          width={196}
          height={196}
          className="w-full rounded-lg object-cover"
        />
      </div>

      <div className="mt-3">
        <h3 className="text-xl font-medium leading-6 text-primary-10 md:text-2xl">
          {data.fullName}
        </h3>

        {data.role.id === Role.HUBER
          ? (
              <>
                <p className="my-1 text-base font-normal text-neutral-30 md:text-lg">
                  {data.topics?.length ?? 0}
                  {' '}
                  topics
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="text-xs leading-[0.875rem] text-neutral-20">
                    <span className="text-[0.625rem] leading-3 text-neutral-40">
                      {t('topics')}
                    </span>
                  </span>
                  <span className="ml-3 flex flex-row items-center justify-center gap-1">
                    <Image
                      width={16}
                      height={16}
                      src="/assets/images/pink-heart.svg"
                      alt="Pink Heart"
                    />
                    <span className="text-xs leading-[0.875rem] text-neutral-20">
                      {data.rating || 0}
                    </span>
                    <span className="text-[0.625rem] leading-3 text-neutral-40">
                      {t('ratings')}
                    </span>
                  </span>
                </div>
              </>
            )
          : null}
      </div>
      {data.role.id === Role.LIBER
        ? (
            <Button
              iconLeft={<CaretCircleRight size={20} />}
              variant="primary"
              className="mt-auto rounded-full"
              onClick={() => {
                if (data.approval === 'Pending') {
                  window.open(`/admin/users/approval/${data.id}`, '_blank');
                } else {
                  router.push(`/users/${data.id}`);
                }
              }}
            >
              {data.approval === 'Pending' ? 'View Detail' : 'Visit Profile'}
            </Button>
          )
        : null}
      {data.role.id === Role.HUBER
        ? (
            <Button
              iconLeft={<CaretCircleRight size={20} />}
              variant="primary"
              className="mt-auto rounded-full"
              onClick={() => router.push(`/admin/users/manage/${data.id}`)}
            >
              View Activity
            </Button>
          )
        : null}
    </div>
  );
};

export default UserCard;
