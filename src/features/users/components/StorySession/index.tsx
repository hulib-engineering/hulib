import Image from 'next/image';

import { DetailBook } from '@/components/storyDetails/DetailBook';
import type { Topic } from '@/libs/services/modules/user/userType';

const StorySession = ({ data }: any) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="mb-5 flex h-[210px] w-full gap-3 rounded-2xl bg-white p-2">
        <Image
          src={
            data?.cover?.path
            ?? '/assets/images/cover-book/story_background_yellow.png'
          }
          alt={`${data?.title} - ${data?.humanBook?.fullName}`}
          width={120}
          height={170}
        />
        <div className="flex flex-col">
          <h5 className="font-medium text-primary-10">{data?.title}</h5>
          <div className="mt-2 flex gap-1">
            <Image
              src="/assets/images/ava-placeholder.png"
              alt="Avatar"
              width={36}
              height={36}
            />
            <div className="flex flex-col">
              <span className="text-sm text-neutral-40">
                {data?.humanBook?.fullName || ''}
              </span>
              <span className="text-sm text-neutral-40">
                {`${data.topics?.length || 0} sessions`}
              </span>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {data?.topics?.map((topic: Topic) => (
              <span
                key={topic.id}
                className="rounded-lg bg-blue-50 p-2 text-sm text-primary-50"
              >
                {topic.name}
              </span>
            ))}
          </div>
        </div>
      </div>
      <DetailBook
        title={data?.title || ''}
        cover="/assets/images/ava-placeholder.png"
        abstract={data?.abstract || ''}
      />
    </div>
  );
};

export default StorySession;
