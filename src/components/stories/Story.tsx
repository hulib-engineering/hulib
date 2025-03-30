import { Bookmarks } from '@phosphor-icons/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { useAddStoryToFavoritesMutation } from '@/libs/services/modules/fav-stories';
import type { Story as StoryType } from '@/libs/services/modules/stories/storiesType';

import Button from '../button/Button';
import { pushError } from '../CustomToastifyContainer';
import { mergeClassnames } from '../private/utils';
import OpenStory from './OpenStory';

interface Props {
  data: StoryType;
}

const Story = (props: Props) => {
  const { data } = props;
  const t = useTranslations('ExporeStory');
  const router = useRouter();
  const [addStoryToFavorites] = useAddStoryToFavoritesMutation();
  const [isHovered, setIsHovered] = useState(false);
  const handleAddToFavorites = async (storyId: number) => {
    try {
      // Call the mutation to add the story to favorites
      await addStoryToFavorites({ storyId: storyId.toString() }).unwrap();
    } catch (err) {
      // Handle the error if mutation fails
      pushError('Error adding story to favorites');
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className={mergeClassnames(
        'relative flex w-full flex-row bg-pink-100 p-4 rounded-xl shadow-sm',
        'h-[300px] md:h-[300px]',
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={mergeClassnames(
          'absolute inset-0 flex flex-row transition-transform duration-500 transform-gpu',
          'md:[transform-style:preserve-3d] md:[backface-visibility:hidden]',
          isHovered ? 'md:rotate-y-180' : 'md:rotate-y-0',
        )}
      >
        <div
          className={mergeClassnames(
            'flex w-1/2 flex-col py-3 relative',
            'md:h-full',
          )}
        >
          <div className={mergeClassnames('flex flex-col gap-2')}>
            <h2
              className={mergeClassnames(
                'text-base font-medium leading-6 text-primary-10 line-clamp-3',
                'md:text-[18px] md:leading-7 md:h-[100px]',
              )}
            >
              {data?.title}
            </h2>
            <div
              className={mergeClassnames('flex flex-row items-center gap-2')}
            >
              <div className="flex flex-row items-center gap-1">
                <Image
                  alt="author-avatar"
                  src="/assets/images/Avatar.png"
                  width={24}
                  height={24}
                  className="size-6 rounded-full"
                />
                <div className="flex flex-col items-start justify-center">
                  <span
                    className={mergeClassnames(
                      'text-xs font-medium leading-4 text-[#73787C] line-clamp-1',
                      'md:text-sm',
                    )}
                  >
                    {data?.humanBook?.fullName}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2 flex flex-row items-center gap-1">
            <Image
              src="/assets/images/icons/heart-yellow.svg"
              width={16}
              height={16}
              className="size-4"
              alt="heart-icon"
            />
            <p
              className={mergeClassnames(
                'text-xs font-medium leading-4 text-neutral-20',
                'md:text-sm',
              )}
            >
              {data?.storyReview?.rating || 0}
            </p>
            <p
              className={mergeClassnames(
                'text-[0.625rem] font-normal text-neutral-40',
                'md:text-xs',
              )}
            >
              {`(${data?.storyReview?.numberOfReviews || 0} ${t('ratings')})`}
            </p>
          </div>

          <div className={mergeClassnames('mt-3 gap-2 block md:hidden')}>
            <h3
              className={mergeClassnames(
                'text-sm font-medium leading-5 text-primary-10',
                'md:text-base',
              )}
            >
              {t('abstract')}
            </h3>
            <p
              className={mergeClassnames(
                'mt-1 line-clamp-3 text-sm font-normal leading-6 text-[#45484A]',
                'md:text-base md:line-clamp-5',
              )}
              style={{ letterSpacing: '0.005rem' }}
            >
              {data?.abstract}
            </p>
          </div>

          <div
            className={mergeClassnames(
              'flex w-full items-center gap-2 justify-self-end mt-3 absolute bottom-[10px]',
              'md:flex-row md:mt-2 md:px-3',
            )}
          >
            <Button
              variant="primary"
              className={mergeClassnames(
                'text-sm h-8 max-h-8 flex-none',
                'md:h-10 md:max-h-10 md:flex-[1]',
              )}
              onClick={() => router.push(`/explore-story/${data?.id}`)}
            >
              {t('read_story')}
            </Button>
            <Button
              variant="outline"
              className={mergeClassnames(
                'w-full h-8',
                'md:size-10 md:min-h-10 md:min-w-10',
              )}
              iconOnly
              onClick={() => handleAddToFavorites(data?.id)}
            >
              <Bookmarks size={20} />
            </Button>
          </div>
        </div>

        <div
          className={mergeClassnames(
            'h-full w-1/2 rounded-2xl relative',
            'md:h-full',
          )}
        >
          <div className="absolute inset-0">
            <Image
              src="/assets/images/cover-test.png"
              alt="book-image"
              width={175}
              height={180}
              className="h-full w-full rounded-2xl"
            />
          </div>
        </div>
      </div>

      <div
        className={mergeClassnames(
          'absolute inset-0 hidden md:block transition-transform duration-500 transform-gpu',
          'md:[transform-style:preserve-3d] md:[backface-visibility:hidden]',
          isHovered ? 'md:rotate-y-0' : 'md:rotate-y-180',
        )}
      >
        <OpenStory content={data?.abstract || ''} title={data?.title || ''} />
      </div>
    </div>
  );
};

export default Story;
