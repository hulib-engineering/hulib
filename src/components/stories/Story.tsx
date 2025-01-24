import { Bookmarks, BookOpen } from '@phosphor-icons/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { useAddStoryToFavoritesMutation } from '@/libs/services/modules/fav-stories';
import type { Story as StoryType } from '@/libs/services/modules/stories/storiesType';

import Button from '../button/Button';
import { pushError } from '../CustomToastifyContainer';
import { mergeClassnames } from '../private/utils';

interface Props {
  data: StoryType;
}

const Story = (props: Props) => {
  const { data } = props;
  const t = useTranslations('ExporeStory');
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
    <div className={mergeClassnames('flex w-full flex-row', 'h-[23rem]')}>
      <div
        className={mergeClassnames(
          'h-full w-1/2 rounded-2xl relative',
          'md:h-full',
        )}
      >
        <Image
          src="/assets/images/image-test.png"
          alt="book-image"
          width={275}
          height={368}
          className="h-full w-full rounded-2xl"
        />
        <div className="absolute left-2 top-2 z-40 flex flex-wrap gap-2">
          {data?.topics.map((topic) => {
            return (
              <div
                key={topic?.id}
                className="rounded-full bg-[#C9ECFF] p-2 text-xs font-normal text-neutral-20"
              >
                {topic?.name || ''}
              </div>
            );
          })}
        </div>
      </div>
      <div
        className={mergeClassnames(
          'flex w-1/2 flex-col rounded-2xl bg-primary-98 px-4 py-3',
          'md:h-full',
        )}
      >
        <div
          className={mergeClassnames(
            'text-base font-medium leading-10 text-primary-10',
            'md:text-[2rem]',
          )}
        >
          {data?.title}
        </div>
        <div className="flex flex-row items-center gap-3">
          <div className="flex flex-row items-center justify-center gap-1">
            <Image
              alt="image-test"
              src="/assets/images/Avatar.png"
              width={24}
              height={24}
              className="size-6 rounded-full"
            />
            <div
              className={mergeClassnames(
                'flex flex-col items-start justify-center gap-1',
                'md:flex-row',
              )}
            >
              <div
                className={mergeClassnames(
                  'text-xs font-medium leading-4 text-[#73787C] line-clamp-3',
                  'md:text-sm',
                )}
              >
                {data?.humanBook?.fullName}
              </div>
              <div className="flex flex-row items-center justify-center gap-1">
                {data?.topics.length > 0 && (
                  <div
                    className={mergeClassnames(
                      'text-[0.625rem] font-medium text-[#2E3032]',
                      'md:text-sm',
                    )}
                  >
                    {data?.topics.length}
                  </div>
                )}
                <div
                  className={mergeClassnames(
                    'text-[0.625rem] font-normal leading-[0.875rem] text-neutral-40',
                    'md:text-sm',
                  )}
                >
                  {t('topics')}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3 flex flex-row items-center gap-1">
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
        <div className="mt-4 gap-2 ">
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
              'mt-2 line-clamp-3 text-sm font-normal leading-6 text-[#45484A]',
              'md:text-base md:line-clamp-5',
            )}
            style={{ letterSpacing: '0.005rem' }}
          >
            {data?.abstract}
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
            iconLeft={<BookOpen size={20} />}
            className={mergeClassnames(
              'text-sm h-8 max-h-8 flex-none w-full',
              'md:h-11 md:max-h-11 md:flex-[1]',
            )}
            onClick={() => router.push(`/explore-story/${data?.id}`)}
          >
            {t('read_story')}
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
            <Bookmarks size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Story;
