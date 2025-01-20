'use client';

import { useParams } from 'next/navigation';
import * as React from 'react';

import HumanBookInfo from '@/components/book-detail/HumanBookInfo';
import Story from '@/components/book-detail/Story';
import { useGetStoryDetailQuery } from '@/libs/services/modules/stories';

export default function Index() {
  const { id } = useParams();
  const { data } = useGetStoryDetailQuery({
    id: Number(id),
  });

  if (!data) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-screen-sm px-4 lg:max-w-screen-2xl lg:px-28">
      <div className="rounded-[20px] bg-white">
        <div className="p-0 lg:p-5">
          <div className="flex flex-col justify-start gap-5 lg:flex-row">
            <div className="flex-1">
              <Story
                cover={{
                  id: data?.cover?.id || '',
                  path: data?.cover?.path || '/assets/images/user-avatar.jpeg',
                }}
                title={data?.title || ''}
                abstract={data?.abstract || ''}
              />
            </div>
            <div className="w-full lg:w-[268px]">
              <HumanBookInfo
                humanBook={data?.humanBook}
                title={data?.title || ''}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
