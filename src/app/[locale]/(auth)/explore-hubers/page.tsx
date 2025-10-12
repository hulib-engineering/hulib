'use client';

import { CaretCircleDown } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import React, { useEffect, useMemo, useState } from 'react';

import Button from '@/components/core/button/Button';
import Loader from '@/components/core/loader/Loader';
import { HuberCard } from '@/components/hubers/HuberCard';
import { HuberCardListSkeleton } from '@/components/loadingState/Skeletons';
import ChipFilter from '@/layouts/webapp/ChipFilter';
import { useGetHubersQuery } from '@/libs/services/modules/huber';
import type { Huber as HuberType } from '@/libs/services/modules/huber/huberType';
import { useInfiniteScroll } from '@/libs/hooks/useInfiniteScroll';
import { useGetMyFavoriteHubersQuery } from '@/libs/services/modules/user';

export default function Index() {
  // const searchParams = useSearchParams();
  // const topicIds = searchParams.get('topicIds')?.split(',') || []; // Convert topicIds to an array

  const t = useTranslations('Huber');

  const [page, setPage] = useState(1);
  const [filterBy, setFilterBy] = useState<number[]>([]);
  const [items, setItems] = useState<HuberType[]>([]);

  const { data: hubers, isLoading: isLoadingHubers, isFetching: isFetchingHubers } = useGetHubersQuery({
    page,
    limit: 8,
    topicIds: filterBy.length > 0 ? filterBy : undefined,
  });
  const { data: favoriteHubers, isLoading: isLoadingFavoriteHubers } = useGetMyFavoriteHubersQuery();
  const hasNextPage
    = hubers?.meta?.currentPage && hubers?.meta?.totalPages
      ? hubers.meta.currentPage < hubers.meta.totalPages
      : false;

  const loadMoreRef = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingHubers) {
      setPage(prevState => prevState + 1);
    }
  }, hasNextPage && !isFetchingHubers);

  useEffect(() => {
    setPage(1);
    setItems([]);
  }, [filterBy]);
  useEffect(() => {
    if (hubers?.data) {
      if (page === 1) {
        setItems(hubers.data); // reset when filter changes
      } else {
        setItems((prev) => {
          return Array.from(new Map([...prev, ...hubers.data].map(i => [i.id, i])).values());
        });
      }
    }
  }, [hubers, page]);

  const hubersWithIsFavoriteStatus = useMemo(() => {
    console.log('favoriteHubers', favoriteHubers);
    return items && items.map((item: HuberType) => {
      const isFavorite
        = favoriteHubers
          && favoriteHubers?.some((favorite: { huberId: number }) => favorite.huberId === item.id);
      return { ...item, isFavorite };
    });
  }, [items, favoriteHubers]);
  console.log('hubersWithIsFavoriteStatus', hubersWithIsFavoriteStatus);

  const handleLoadMore = () => {
    if (hasNextPage) {
      setPage(prev => prev + 1);
    }
  };

  if (isLoadingHubers || isLoadingFavoriteHubers) {
    return (
      <div className="mx-auto w-full px-4 py-8 lg:w-5/6 lg:px-0">
        <HuberCardListSkeleton />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full py-6 lg:w-5/6 lg:py-8">
      <div className="flex flex-col gap-4 bg-white p-4 lg:gap-6 lg:bg-transparent lg:p-5">
        <div className="flex flex-col gap-1 text-primary-10 lg:text-neutral-20">
          <h1 className="text-2xl font-medium leading-8 lg:text-[40px] lg:font-bold lg:leading-tight">
            {t('title')}
          </h1>
          <p className="hidden text-lg lg:block">{t('description')}</p>
        </div>

        <div>
          <div className="hidden lg:block">
            <ChipFilter values={filterBy} onChange={setFilterBy} scrollable={false} />
          </div>
          <div className="lg:hidden">
            <ChipFilter values={filterBy} onChange={setFilterBy} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {hubersWithIsFavoriteStatus?.map((huber: HuberType) => (
            <HuberCard key={huber.id} {...huber} />
          ))}
        </div>

        {/* Infinite scroll anchor */}
        <div ref={loadMoreRef} className="hidden h-px lg:block" />

        {(isFetchingHubers || hasNextPage) && (
          <div className="flex w-full items-center justify-center">
            {isFetchingHubers ? <Loader /> : (
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
};
