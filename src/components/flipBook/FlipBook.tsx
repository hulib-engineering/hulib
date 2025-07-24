import { BookmarkSimple } from '@phosphor-icons/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';

import { pushError, pushSuccess } from '../CustomToastifyContainer';
import AnimatedCover from '../stories/AnimatedCover';
import Button from '@/components/button/Button';
import { mergeClassnames } from '@/components/private/utils';
import { useAppSelector } from '@/libs/hooks';
import {
  useAddStoryToFavoritesMutation,
  useDeleteFavoriteStoryMutation,
} from '@/libs/services/modules/fav-stories';
import type { Story as StoryType } from '@/libs/services/modules/stories/storiesType';

type BookCommonProps = {
  data: StoryType;
  renderActions?: () => React.ReactNode;
  // refetch: () => void;
};

export const FlipBook = ({ data, renderActions }: BookCommonProps) => {
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const userId = userInfo?.id;
  const { title } = data || {};
  const t = useTranslations('ExploreStory');
  const [isFavorite, setIsFavorite] = useState(data?.isFavorite);

  useEffect(() => {
    setIsFavorite(data?.isFavorite);
  }, [data?.isFavorite]);

  const router = useRouter();

  const [addStoryToFavorites] = useAddStoryToFavoritesMutation();
  const [deleteFavoriteStory] = useDeleteFavoriteStoryMutation();

  const handleAddToFavorites = async (storyId: number) => {
    try {
      setIsFavorite(!isFavorite);

      if (isFavorite) {
        const response = await deleteFavoriteStory({
          storyId,
          userId,
        }).unwrap();
        pushSuccess(response?.message || t('story_removed_from_favorites'));
      } else {
        const response = await addStoryToFavorites({
          storyId,
          userId,
        }).unwrap();
        pushSuccess(response?.message || t('story_added_to_favorites'));
      }
    } catch (err: any) {
      setIsFavorite(isFavorite);
      pushError(err?.data?.message || t('error_contact_admin'));
    }
  };

  const renderActionsRead = (storyId: number) => {
    return (
      <div
        className={mergeClassnames(
          'flex w-full items-center gap-2 justify-self-end mt-3 absolute bottom-[10px] left-2 right-2',
          'md:flex-row md:mt-2 md:px-3 md:pl-0',
        )}
      >
        <Button
          variant="primary"
          className={mergeClassnames(
            'text-base h-8 max-h-8 w-[120px] flex-none rounded-full px-[12px] py-[12px]',
            'md:h-[44px] md:max-h-[44px] md:w-[105px]',
          )}
          onClick={() => router.push(`/explore-story/${storyId}`)}
        >
          {t('read_story')}
        </Button>
        <Button
          variant="outline"
          className={mergeClassnames(
            'w-8 h-8 min-w-[32px]',
            'md:size-10 md:min-h-10 md:min-w-10 bg-white border-neutral-variant',
          )}
          iconOnly
          onClick={() => {
            handleAddToFavorites(storyId);
          }}
        >
          <BookmarkSimple
            size={20}
            weight={isFavorite ? 'fill' : 'regular'}
            color={isFavorite ? '#F6CE3C' : '#0442BF'}
          />
        </Button>
      </div>
    );
  };

  return (
    <div
      className={mergeClassnames(
        'relative flex w-full flex-row bg-pink-100 p-2 rounded-xl shadow-sm max-w-[400px]',
        'min-h-[250px]',
        'sm:p-3 sm:min-h-[270px]',
        'md:p-4 md:min-h-[287px]',
      )}
    >
      {/* Front-Card */}
      <div
        className={mergeClassnames(
          'absolute inset-0 flex flex-row gap-2 bg-white p-2 rounded-2xl transition-transform duration-500 transform-gpu',
          'sm:p-3',
          'md:p-4 md:[transform-style:preserve-3d] md:[backface-visibility:hidden]',
        )}
      >
        <div
          className={mergeClassnames(
            'flex w-1/2 flex-col pt-3 relative',
            'md:h-full',
          )}
        >
          <div className={mergeClassnames('flex flex-col gap-2')}>
            <h2
              className={mergeClassnames(
                'text-base font-medium leading-6 text-primary-10 line-clamp-3 capitalize',
                'md:text-[18px] md:leading-7',
              )}
            >
              {data?.title.toLowerCase()}
            </h2>
            <div
              className={mergeClassnames('flex flex-row items-center gap-2')}
            >
              <div className="flex flex-row items-center gap-1">
                <Image
                  alt="author-avatar"
                  src="/assets/images/ava-placeholder.png"
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

            <div className="flex flex-row items-center gap-1">
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

            {/* <div className={mergeClassnames('mt-3 gap-2 block md:hidden')}>
              <h3
                className={mergeClassnames(
                  'text-sm font-medium leading-5 mb text-primary-10',
                  'md:text-base',
                )}
              >
                {t('abstract')}
              </h3>
              <p
                className={mergeClassnames(
                  'mt-1 line-clamp-3 text-sm font-normal mb-14 leading-6 text-[#45484A]',
                  'md:text-base md:line-clamp-5',
                )}
                style={{ letterSpacing: '0.005rem' }}
              >
                {data?.abstract}
              </p>
            </div> */}

            {renderActions
              ? renderActions()
              : renderActionsRead(data?.id || data?.storyId || 0)}
          </div>
        </div>
        <div
          className={mergeClassnames(
            'h-full w-1/2 rounded-2xl relative',
            'md:h-full',
          )}
        >
          <AnimatedCover
            abstract={data?.abstract ?? ''}
            title={title}
            authorName={data?.humanBook?.fullName || ''}
            coverUrl={data?.cover?.path || ''}
            highlightTitle={data?.highlightTitle}
            highlightAbstract={data?.highlightAbstract}
            onClick={() => router.push(`/explore-story/${data?.id}`)}
          />
        </div>
      </div>
    </div>
  );
};
