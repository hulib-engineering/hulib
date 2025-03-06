import './FlipBook.css';

import { Bookmarks, BookOpen, Heart } from '@phosphor-icons/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import Button from '@/components/button/Button';
import { pushError } from '@/components/CustomToastifyContainer';
import { mergeClassnames } from '@/components/private/utils';
import { useAddStoryToFavoritesMutation } from '@/libs/services/modules/fav-stories';
import type { Story as StoryType } from '@/libs/services/modules/stories/storiesType';

export type BookCommonProps = {
  data: StoryType;
};
export const FlipBook = ({ data }: BookCommonProps) => {
  const {
    title,
    cover,
    topics,
    storyReview,
    humanBook,
    abstract = 'Lorem ipsum dolor sit amet consectetur. Eget magna vel platea pulvinar tempor dui massa ut. Egestas nunc mi tristique ornare commodo vitae dignissim commodo. Pellentesque nulla nam ante turpis velit amet cras ac aliquam. Ut amet nulla lobortis amet. Varius aliquam commodo mauris.Lorem ipsum dolor sit amet consectetur. Eget magna vel platea pulvinar tempor dui massa ut. Egestas nunc mi tristique ornare commodo vitae dignissim commodo. Pellentesque nulla nam ante turpis velit amet cras ac aliquam. Ut amet nulla lobortis amet. Varius aliquam commodo mauris.Lorem ipsum dolor sit amet consectetur. Eget magna vel platea pulvinar',
  } = data;
  const [isFlipped, setIsFlipped] = useState(false);
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

  const detectDeviceType = () =>
    /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent)
      ? 'Mobile'
      : 'Desktop';

  const isMobile = React.useMemo(() => {
    const deviceType = detectDeviceType();
    return deviceType === 'Mobile';
  }, []);

  // Function to toggle the card flip
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="flip-card-container">
      <div className={`flip-card ${isFlipped ? 'flipped' : ''}`}>
        <div className="flip-card-front">
          <div className="grid h-full w-full grid-cols-2 gap-x-4 rounded-2xl bg-[#FFFFFF] p-4 shadow-[3px_4px_5px_3px_#1C1E211A]">
            <div className="relative flex h-full w-full flex-col gap-y-2 py-2">
              <h6 className="book-title">{title}</h6>
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
              <div className={mergeClassnames('flex items-center gap-2 mt-4')}>
                <Button
                  variant="primary"
                  iconLeft={<BookOpen size={20} weight="bold" />}
                  className={mergeClassnames('text-sm font-medium py-3 px-6')}
                  onClick={() => router.push(`/explore-story/${data?.id}`)}
                >
                  Read all
                </Button>
                <Button
                  variant="outline"
                  className={mergeClassnames('p-3')}
                  iconOnly
                  onClick={() => handleAddToFavorites(data?.id)}
                >
                  <Bookmarks size={20} color="#0442BF" weight="bold" />
                </Button>
              </div>
            </div>
            <div className="relative flex h-full w-full items-center justify-center">
              <button
                type="button"
                onClick={isMobile ? handleFlip : undefined}
                onMouseEnter={!isMobile ? handleFlip : undefined}
              >
                <Image
                  src={cover?.path ?? '/assets/images/image-test.png'}
                  alt="book cover"
                  priority
                  quality={100}
                  width={180}
                  height={255}
                />
              </button>
            </div>
          </div>
        </div>
        <div className="flip-card-back">
          <div
            className="grid h-full w-full grid-cols-2 rounded-2xl bg-[#FFFFFF] p-4 shadow-[3px_4px_5px_3px_#1C1E211A]"
            onMouseLeave={!isMobile ? handleFlip : undefined}
          >
            <button type="button" onClick={isMobile ? handleFlip : undefined}>
              <div className="page-left">
                <h6 className="break-words text-xl font-medium text-primary-10">
                  {title}
                </h6>
                <p className="h-full w-full pl-2 pr-1 text-left text-sm text-neutral-30">
                  {abstract?.substring(0, 200) ?? ''}
                </p>
              </div>
            </button>
            <div className="page-right">
              <p className="mt-1 h-full w-full pl-2 pr-1 text-left text-sm text-neutral-30">
                {abstract?.substring(200, 380) ?? ''}
              </p>
              <div className="mb-2 flex justify-center">
                <Button
                  variant="primary"
                  iconLeft={<BookOpen size={20} weight="bold" />}
                  className="w-fit px-4 py-2 text-sm font-medium"
                  onClick={() => router.push(`/explore-story/${data?.id}`)}
                >
                  Read all
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
