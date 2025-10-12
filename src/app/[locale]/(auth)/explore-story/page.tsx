'use client';

import {
  ArrowSquareDown,
  ArrowSquareUp,
  BookmarkSimple,
  CaretCircleDown,
  FadersHorizontal,
} from '@phosphor-icons/react';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React, { useEffect, useMemo, useState } from 'react';

import Button from '@/components/core/button/Button';
import Dropdown from '@/components/core/dropdown/Dropdown';
import Loader from '@/components/core/loader/Loader';
import MenuItem from '@/components/core/menuItem/MenuItem';
import IconButton from '@/components/core/iconButton/IconButton';
import { mergeClassnames } from '@/components/core/private/utils';
import { StoryCard } from '@/components/stories/StoryCard';
import ChipFilter from '@/layouts/webapp/ChipFilter';
import { useGetStoriesQuery } from '@/libs/services/modules/stories';
import type { Story as StoryType } from '@/libs/services/modules/stories/storiesType';
import { useGetMyFavoritesQuery } from '@/libs/services/modules/user';
import { StoriesSkeleton } from '@/components/loadingState/Skeletons';

export default function Index() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const topicIds = searchParams.getAll('topicIds'); // Get topicIds from the URL query string

  const t = useTranslations('ExploreStory');

  const [page, setPage] = useState(1);
  const [filterBy, setFilterBy] = useState<number[]>(topicIds?.map(id => Number(id)) ?? []);
  const [orderBy, setOrderBy] = useState('newest');

  const {
    data: stories,
    isLoading,
    isFetching,
  } = useGetStoriesQuery({
    page,
    limit: 9,
    topicIds: filterBy.length > 0 ? filterBy : undefined,
    sort: [{ orderBy: 'createdAt', order: orderBy === 'newest' ? 'DESC' : 'ASC' }],
  });
  const { data: favoriteStories } = useGetMyFavoritesQuery();

  const storiesWithFavorites = useMemo(() => {
    return stories && stories?.data && stories?.data.map((story: StoryType) => {
      const isFavorite
        = favoriteStories
          && favoriteStories?.some((favorite: any) => favorite.storyId === story.id);
      return { ...story, isFavorite };
    });
  }, [stories, favoriteStories]);

  // Update URL when filterBy changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    // Clear existing topicIds
    params.delete('topicIds');

    // Add selected topicIds
    filterBy.forEach((id) => {
      params.append('topicIds', id.toString());
    });

    router.replace(`${pathname}?${params.toString()}`);
  }, [filterBy, pathname, router, searchParams]); // Run whenever filterBy changes

  const SortPopoverMenuItems = [
    {
      value: 'favorites',
      label: 'My favorite',
      icon: <BookmarkSimple className="text-2xl text-primary-60" />,
    },
    {
      value: 'newest',
      label: 'Newest Stories',
      icon: <ArrowSquareUp className="text-2xl text-primary-60" />,
    },
    {
      value: 'oldest',
      label: 'Oldest Stories',
      icon: <ArrowSquareDown className="text-2xl text-primary-60" />,
    },
  ];

  const handleLoadMore = () => {
    if (stories.hasNextPage) {
      setPage(prev => prev + 1);
    }
  };

  if (isLoading || !stories) {
    return (
      <div className="mx-auto w-full px-4 py-8 lg:w-5/6 lg:px-0">
        <StoriesSkeleton />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full py-6 lg:w-5/6 lg:py-12">
      <div className="flex flex-col gap-4 bg-white p-4 shadow-sm lg:gap-6 lg:bg-transparent lg:py-5 lg:shadow-none">
        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-medium leading-8 text-primary-10 lg:text-[2.5rem] lg:font-bold lg:leading-tight">
            Explore our all stories
          </h3>
          <p className="hidden text-lg leading-snug text-neutral-20 lg:block">{t('description')}</p>
        </div>
        <div className="flex items-center gap-2 lg:items-start">
          <div className="flex-1 overflow-x-auto lg:overflow-visible">
            <div className="hidden lg:block">
              <ChipFilter values={filterBy} onChange={setFilterBy} scrollable={false} />
            </div>
            <div className="lg:hidden">
              <ChipFilter values={filterBy} onChange={setFilterBy} />
            </div>
          </div>
          <Dropdown
            position="bottom-end"
            className="w-fit"
            value={orderBy}
            onChange={value => setOrderBy(value as unknown as string)}
          >
            <Dropdown.Trigger aria-label="Dropdown trigger">
              <IconButton
                variant="outline"
                size="lg"
                className="w-11 shrink-0"
              >
                <FadersHorizontal />
              </IconButton>
            </Dropdown.Trigger>
            <Dropdown.Options className="my-2 w-max gap-4 p-4">
              {SortPopoverMenuItems.map(item => (
                <Dropdown.Option key={item.value} value={item.value}>
                  {({ selected, active }) => (
                    <MenuItem
                      isActive={active}
                      isSelected={selected}
                      className="p-0 text-base font-medium"
                    >
                      {item.icon}
                      <MenuItem.Title>{item.label}</MenuItem.Title>
                    </MenuItem>
                  )}
                </Dropdown.Option>
              ))}
            </Dropdown.Options>
          </Dropdown>
        </div>

        {stories?.data.length > 0
          ? (
              <div
                className={mergeClassnames(
                  'grid grid-cols-1 gap-4 rounded-lg',
                  'sm:gap-6 sm:px-4',
                  'md:grid-cols-2 md:gap-8 md:px-0',
                  'xl:grid-cols-3',
                )}
              >
                {storiesWithFavorites?.map((item: StoryType) => (
                  <StoryCard key={item.id} data={item} />
                ))}
              </div>
            )
          : (
              <div className="flex w-full flex-col items-center justify-center gap-5">
                <Image
                  src="/assets/images/no-results-found.png"
                  className="h-auto w-full object-contain"
                  width={300}
                  height={300}
                  quality={100}
                  alt="No results found"
                />
                <h5 className="text-2xl font-bold leading-snug text-primary-10">No data available.</h5>
              </div>
            )}

        {(isFetching || stories.hasNextPage) && (
          <div className="flex w-full items-center justify-center">
            {isFetching ? <Loader /> : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  iconLeft={<CaretCircleDown />}
                  className="lg:hidden"
                  onClick={handleLoadMore}
                >
                  View more
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  iconLeft={<CaretCircleDown />}
                  className="hidden lg:flex"
                  onClick={handleLoadMore}
                >
                  View more
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
