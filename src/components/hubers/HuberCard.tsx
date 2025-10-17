'use client';

import { CaretCircleRight, Heart, UserCheck, UserPlus } from '@phosphor-icons/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

import Button from '@/components/core/button/Button';
import IconButton from '@/components/core/iconButton/IconButton';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import type { Huber as THuber } from '@/libs/services/modules/huber/huberType';
import { useAddHuberToMyFavoritesMutation, useRemoveHuberFromMyFavoritesMutation } from '@/libs/services/modules/user';

const HuberCard = (
  props: Partial<THuber> & {
    isFavorite?: boolean;
    showAdminControls?: boolean;
    awaiting?: boolean;
    showNoActions?: boolean;
    isHuber?: boolean;
  },
) => {
  const router = useRouter();

  const tCommon = useTranslations('Common');
  const t = useTranslations('Huber.card');

  const [addToMyFavorites, { isLoading: isAddingToMyFavorites }] = useAddHuberToMyFavoritesMutation();
  const [removeFromMyFavorites, { isLoading: isRemovingFromMyFavorites }] = useRemoveHuberFromMyFavoritesMutation();

  const [isFavorite, setIsFavorite] = useState(props.isFavorite);

  const handleAddToMyFavorites = async () => {
    try {
      if (!isFavorite) {
        await addToMyFavorites(props.id);
        setIsFavorite(true);
        pushSuccess('Successfully added to favorite list');
      } else {
        await removeFromMyFavorites(props.id);
        setIsFavorite(false);
        pushSuccess('Successfully removed from favorite list');
      }
    } catch (err: any) {
      pushError(err?.data?.message || tCommon('error_contact_admin'));
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {props.awaiting ? (
        <div className="relative w-full overflow-hidden rounded-[32px] bg-neutral-90">
          <Image
            src={props.photo?.path ?? '/assets/images/ava-placeholder.png'}
            alt="User Avatar"
            width={270}
            height={270}
            className="aspect-[1/1] h-auto w-full rounded-[32px] object-cover"
          />
          <div className="absolute bottom-4 left-0 flex w-full items-center justify-center">
            <span className="rounded-full bg-orange-90 px-4 py-1 text-xs leading-[14px] text-orange-50">Waiting for approval</span>
          </div>
        </div>
      ) : (
        <div className="group relative w-full overflow-hidden rounded-[32px] bg-neutral-90">
          <Image
            src={props.photo?.path ?? '/assets/images/ava-placeholder.png'}
            alt="Huber Avatar"
            width={270}
            height={270}
            className="aspect-[1/1] h-auto w-full rounded-[32px] object-cover"
          />

          <div className="absolute bottom-0 left-0 hidden h-[140px] w-full bg-gradient-to-b from-[#343330]/0 to-[#343330] bg-blend-multiply lg:group-hover:block" />

          <div className="absolute bottom-0 left-0 z-10 hidden h-[140px] w-full p-4 lg:group-hover:block">
            <p className="line-clamp-5 text-xs text-neutral-90">{props.bio}</p>
          </div>

          {props.sharingTopics && (
            <div className="absolute inset-0 flex h-fit items-center gap-2 p-4 lg:hidden lg:group-hover:flex">
              {props.sharingTopics.map((topic, index) => {
                const colors = [
                  {
                    backgroundColor: 'rgba(217, 249, 207, 1)',
                    borderColor: 'rgba(178, 243, 159, 1)',
                  },
                  {
                    backgroundColor: 'rgba(255, 228, 241, 1)',
                    borderColor: 'rgba(255, 201, 227, 1)',
                  },
                  {
                    backgroundColor: 'rgba(205, 221, 254, 1)',
                    borderColor: 'rgba(132, 172, 252, 1)',
                  },
                ];

                const colorIndex = index % colors.length;
                const tagColor = colors[colorIndex];

                if (!props.humanBookTopic || props.humanBookTopic.length === 0) {
                  return null;
                }

                return (
                  <span
                    key={topic.id}
                    className="rounded-full px-3 py-2 text-xs font-medium leading-[14px] text-opacity-80"
                    style={{
                      backgroundColor: tagColor?.backgroundColor,
                      border: `1px solid ${tagColor?.borderColor}`,
                    }}
                  >
                    {topic.name}
                  </span>
                );
              })}
            </div>
          )}

        </div>
      )}

      <div className="flex flex-col gap-1">
        <p className="line-clamp-1 text-2xl font-medium leading-8 text-primary-10">
          {props.fullName}
        </p>
        {!props.awaiting && props.isHuber && (
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <span className="text-xs leading-[14px] text-neutral-20">
                {props.humanBookTopic?.length ?? 0}
              </span>
              <span className="text-[0.625rem] leading-tight text-neutral-40">
                {t('topics')}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="text-pink-50" weight="fill" />
              <span className="text-xs leading-4 text-neutral-20">
                {props.rating ?? 0}
              </span>
              <span className="text-[0.625rem] leading-3 text-neutral-40">
                Hearts
              </span>
            </div>
          </div>
        )}
      </div>

      {!props.showNoActions && (
        <div className="flex w-full items-center justify-between gap-1">
          {!props.awaiting ? (
            <>
              <Button
                size="lg"
                fullWidth
                className="hidden lg:flex"
                onClick={() => router.push(`/users/${props.id}`)}
              >
                <span className="flex items-center gap-2">
                  <CaretCircleRight className="text-xl" />
                  Visit Profile
                </span>
              </Button>
              <Button
                variant="secondary"
                size="lg"
                fullWidth
                className="lg:hidden"
                onClick={() => router.push(`/users/${props.id}`)}
              >
                <span className="flex items-center gap-2">
                  <CaretCircleRight className="text-xl" />
                  Visit Profile
                </span>
              </Button>
            </>
          ) : (
            <Button
              size="lg"
              fullWidth
              onClick={() => router.push(`/users/${props.id}/approval`)}
            >
              <span className="flex items-center gap-2">
                <CaretCircleRight className="text-xl" />
                View Detail
              </span>
            </Button>
          )}

          {!props.showAdminControls && (
            <IconButton
              variant="outline"
              size="lg"
              disabled={isAddingToMyFavorites || isRemovingFromMyFavorites}
              animation={(isAddingToMyFavorites || isRemovingFromMyFavorites) && 'progress'}
              onClick={handleAddToMyFavorites}
            >
              {isFavorite
                ? <UserCheck weight="fill" size={20} className="text-pink-50" />
                : <UserPlus weight="bold" size={20} className="text-primary-50" />}
            </IconButton>
          )}
        </div>
      )}
    </div>
  );
};

export { HuberCard };
