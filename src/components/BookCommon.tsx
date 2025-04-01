import { Bookmarks, BookOpen, Heart } from '@phosphor-icons/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

import Button from '@/components/button/Button';
import { pushError } from '@/components/CustomToastifyContainer';
import { mergeClassnames } from '@/components/private/utils';
import { useAddStoryToFavoritesMutation } from '@/libs/services/modules/fav-stories';
import type { Story as StoryType } from '@/libs/services/modules/stories/storiesType';

export type BookCommonProps = {
  data: StoryType;
};

export const BookCommon = ({ data }: BookCommonProps) => {
  const { title, cover, topics, storyReview, humanBook } = data;
  const router = useRouter();

  const [addStoryToFavorites] = useAddStoryToFavoritesMutation();

  const handleAddToFavorites = async (storyId: number) => {
    try {
      // Call the mutation to add the story to favorites
      await addStoryToFavorites({ storyId: storyId.toString() }).unwrap();
    } catch (err) {
      // Handle the error if mutation fails
      pushError('Error adding story to favorites');
    }
  };

  return (
    <div className="grid grid-cols-2 gap-x-4 rounded-2xl bg-[#FFFFFF] p-4 shadow-[3px_4px_5px_3px_#1C1E211A]">
      <div className="flex w-full flex-col gap-y-2 py-2">
        <h6 className="break-words text-xl font-medium text-primary-10">
          {title ?? 'Cứ làm đi biết đâu thất bại'}
        </h6>
        <div className="flex items-center gap-x-2">
          {topics?.map((topic) => (
            <p
              key={topic.id}
              className="rounded-lg bg-[#C9ECFF] px-2 py-1 text-xs text-neutral-20"
            >
              {topic?.name}
            </p>
          ))}
        </div>
        <div className="flex items-center gap-x-2">
          <Image
            src={humanBook?.photo?.path ?? '/assets/images/Avatar.png'}
            alt="avatar author"
            width={18}
            height={18}
          />
          <p className="text-xs font-medium text-[#73787C]">
            {humanBook?.fullName ?? 'Developer'}
          </p>
        </div>
        <div className="flex items-center gap-x-2">
          <Heart size={16} color="#F3C00C" weight="fill" />
          <p className="text-sm font-medium text-neutral-20">
            {storyReview?.rating ?? 0}
          </p>
          <p className="text-xs text-neutral-40 ">
            {storyReview?.numberOfReviews ?? 0} rating
          </p>
        </div>
        <div
          className={mergeClassnames(
            'flex h-full flex-col items-center gap-2 justify-self-end mt-5',
            'md:flex-row md:mt-10',
          )}
        >
          <Button
            variant="primary"
            iconLeft={<BookOpen size={20} weight="bold" />}
            className={mergeClassnames(
              'text-sm font-medium h-8 max-h-8 flex-none w-full',
              'md:h-11 md:max-h-11 md:flex-[1]',
            )}
            onClick={() => router.push(`/explore-story/${data?.id}`)}
          >
            Read all
          </Button>
          <Button
            variant="outline"
            className={mergeClassnames(
              'w-full h-8',
              'md:size-11 md:min-h-11 md:min-w-11',
            )}
            iconOnly
            onClick={() => handleAddToFavorites(data?.id)}
          >
            <Bookmarks size={20} color="#0442BF" weight="bold" />
          </Button>
        </div>
      </div>
      <div className="relative flex w-full flex-col gap-y-4">
        <Image
          src={cover?.path ?? '/assets/images/image-test.png'}
          alt="book cover"
          fill
          priority
          quality={100}
          className="object-fill"
        />
      </div>
    </div>
  );
};
