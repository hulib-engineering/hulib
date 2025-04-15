'use client';

import { Bookmarks, CaretCircleRight } from '@phosphor-icons/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import Button from '../button/Button';

const Huber = ({
  huber = {
    name: 'Tran Thanh Thao',
    role: 'Professor',
    topics: 20,
    rating: 4.2,
    abtract: `Lorem ipsum dolor sit amet consectetur. Eget magna vel platea
    pulvinar tempor dui massa ut. Egestas nunc mi tristique ornare
    commodo vitae dignissim commodo. Pellentesque...`,
    image: '/assets/images/huber/cover-huber.png',
    id: 0,
    tags: ['Self-taught', 'Study', 'Career Huber'],
  },
}) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-lg">
        <Image
          src={huber.image}
          alt={huber.name}
          width={0}
          height={0}
          sizes="100vw"
          className="w-full rounded-lg object-cover"
        />

        <div
          className={`absolute left-[10%] top-[10%] flex flex-wrap gap-2 transition-opacity duration-300 md:opacity-0 ${
            isHovered ? 'md:opacity-100' : ''
          }`}
        >
          {huber.tags.map((tag, index) => {
            const colors = [
              {
                backgroundColor: 'rgba(217, 249, 207, 1)',
                borderColor: ' rgba(178, 243, 159, 1)',
              },
              {
                backgroundColor: ' rgba(255, 228, 241, 1)',
                borderColor: 'rgba(255, 201, 227, 1)',
              },
              {
                backgroundColor: ' rgba(205, 221, 254, 1)',
                borderColor: ' rgba(132, 172, 252, 1)',
              },
            ];

            const colorIndex = index % colors.length;
            const tagColor = colors[colorIndex];

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
        px-4 text-white opacity-0
        transition-all duration-300 ease-in-out
        md:block md:opacity-0 md:translate-y-8
        ${isHovered ? 'rounded-lg md:opacity-100 md:translate-y-0' : ''}
          `}
        >
          <p className="text-[12px] font-normal">
            {huber.abtract.length > 150
              ? `${huber.abtract.slice(0, 150)}...`
              : huber.abtract}
          </p>
        </div>
      </div>

      <div className="mt-3">
        <h3 className="text-xl font-medium leading-6 text-primary-10 md:text-2xl">
          {huber.name}
        </h3>
        <p className="my-1 text-base font-normal text-neutral-30 md:text-lg">
          {huber.role}
        </p>
        <div className="flex items-center text-sm text-gray-500">
          <span className="text-xs leading-[0.875rem] text-neutral-20">
            {`${huber.topics}`}{' '}
            <span className="text-[0.625rem] leading-3 text-neutral-40">
              Topics
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
              {huber.rating}
            </span>
            <span className="text-[0.625rem] leading-3 text-neutral-40">
              Hearts
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
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => router.push(`/profile/${huber.id}`)}
          >
            <CaretCircleRight size={20} />
            <p>Visit Profile</p>
          </Button>
        </div>

        {/* Mobile view */}
        <div className="block grow md:hidden">
          <Button
            variant="primary"
            className="flex w-full items-center justify-center gap-2 rounded-full py-2 text-sm"
            onClick={() => router.push(`/profile/${huber.id}`)}
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
