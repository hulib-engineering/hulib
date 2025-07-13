'use client';

import { Bookmarks, CaretCircleRight } from '@phosphor-icons/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React, { useMemo, useState } from 'react';

import Button from '../button/Button';
import type { Huber as HuberType } from '@/libs/services/modules/huber/huberType';
import type { Topic } from '@/libs/services/modules/topics/topicType';

type HuberCommonProps = {
  data: HuberType;
  topics: Topic[];
};
const Huber = ({ data: huber, topics }: HuberCommonProps) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const t = useTranslations('Huber.card');
  // Tạo topicMap để tra cứu topicName từ topicId
  const topicMap = useMemo(() => {
    const map = new Map<number, string>();
    topics.forEach((topic) => {
      map.set(topic.id, topic.name);
    });
    return map;
  }, [topics]);

  // Lấy danh sách tên topic từ humanBookTopic
  const topicNames = huber.humanBookTopic
    .map(item => topicMap.get(item.topicId) || 'Unknown Topic')
    .join(', ');

  return (
    <div
      className="w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-lg">
        <Image
          src={huber.photo?.path ?? '/assets/images/huber/cover-huber.png'}
          alt={huber.fullName}
          width={0}
          height={0}
          sizes="100vw"
          className="w-full rounded-lg object-cover"
        />
        <div className="absolute inset-0 m-[20px] rounded-lg ">
          <div
            className={`top-[10%] flex flex-wrap gap-2 transition-opacity duration-300 md:opacity-0 ${
              isHovered ? 'md:opacity-100' : ''
            }`}
          >
            {topicNames.split(', ').map((tag, index) => {
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

              if (huber.humanBookTopic.length === 0) {
                return null;
              }

              return (
                <span
                  key={index}
                  className="rounded-full px-3 py-1 text-xs font-medium"
                  style={{
                    backgroundColor: tagColor?.backgroundColor,
                    border: `1px solid ${tagColor?.borderColor}`,
                  }}
                >
                  {tag}
                </span>
              );
            })}
          </div>

          <div
            className={`
          absolute inset-x-0 bottom-0 top-1/2 hidden max-h-[35%]
           text-white opacity-0
          transition-all duration-300 ease-in-out
          md:block md:opacity-0 md:translate-y-8
          ${isHovered ? 'rounded-lg md:opacity-100 md:translate-y-0' : ''}
            `}
          >
            <p
              className="line-clamp-3 text-[12px] font-normal"
              style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {huber.bio
                ? huber.bio.length > 150
                  ? `${huber.bio.slice(0, 150)}...`
                  : huber.bio
                : t('introduce', { fullName: huber.fullName })}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <h3 className="text-xl font-medium leading-6 text-primary-10 md:text-2xl">
          {huber.fullName}
        </h3>
        <p className="my-1 text-base font-normal text-neutral-30 md:text-lg">
          {/* {huber.role} */}
          {/* {huber.humanBookTopic.length} */}
        </p>
        <div className="flex items-center text-sm text-gray-500">
          <span className="text-xs leading-[0.875rem] text-neutral-20">
            {/* {`${huber.topics}`}{' '} */}
            {huber.humanBookTopic.length}
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
              {huber.rating || 0}
            </span>
            <span className="text-[0.625rem] leading-3 text-neutral-40">
              {t('ratings')}
            </span>
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        {/* Desktop view */}
        <div className="hidden grow md:block">
          <Button
            variant="primary"
            className="flex w-full items-center justify-center gap-2 py-2.5"
            onClick={() => router.push(`/profile?huberId=${huber.id}`)}
          >
            <CaretCircleRight size={20} />
            <p>{t('visit_profile')}</p>
          </Button>
        </div>

        {/* Mobile view */}
        <div className="block grow md:hidden">
          <Button
            variant="primary"
            className="flex w-full items-center justify-center gap-2 rounded-full py-2 text-sm"
            onClick={() => router.push(`/profile?huberId=${huber.id}`)}
          >
            <p>Visit Profile</p>
          </Button>
        </div>

        <Button
          variant="outline"
          className="size-10 flex-none rounded-full border border-neutral-70"
          iconOnly
        >
          <Bookmarks size={20} />
        </Button>
      </div>
    </div>
  );
};

export default Huber;
