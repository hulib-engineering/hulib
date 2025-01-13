'use client';

import { MagnifyingGlass, X } from '@phosphor-icons/react/dist/ssr';
import React, { useCallback, useRef, useState } from 'react';
import { Controller, type UseFormReturn } from 'react-hook-form';

import Form from '@/components/form/Form';
import { useDebounce } from '@/libs/hooks';
import type { Topic } from '@/libs/services/modules/topics';
import { useGetTopicsQuery } from '@/libs/services/modules/topics';

import { mergeClassnames } from '../private/utils';
import TopicSkeleton from './TopicsSkeleton';

interface Props {
  methods: UseFormReturn<
    {
      about: string;
      section: number[];
      education: string;
      from: number;
      to: number;
    },
    any,
    undefined
  >;
  label: string;
  placeholder: string;
}

const SearchSections = (props: Props) => {
  const { methods, label, placeholder } = props;
  const [searchText, setSearchText] = React.useState('');
  const [searchSuggestion, setSearchSuggestion] = React.useState(false);
  const suggestionRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const debouncedSearch = useDebounce(searchText);

  const [page, setPage] = useState(0);
  const {
    data: topicPages,
    isLoading,
    isFetching,
  } = useGetTopicsQuery({
    page,
    limit: 10,
    name: debouncedSearch,
  });

  const getTopicById = useCallback(
    (id: number) => {
      return topicPages?.data?.find((item: Topic) => item?.id === id);
    },
    [topicPages?.data],
  );

  const handleFetchNextPage = () => {
    setPage((prev) => prev + 1);
  };

  const handleRemove = (value: number) => {
    const section = methods.getValues('section');
    const removedSection = section.filter((item) => item !== value);

    methods.setValue('section', removedSection);
  };

  const onChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
    setPage(1);
  };

  const handleAdd = (event: React.MouseEvent<HTMLDivElement>, value: Topic) => {
    const section = methods.getValues('section');
    const isExisted = section.find((item) => item === value);

    if (!isExisted && value?.id) {
      methods.setValue('section', [...section, value?.id]);
    }
    event.stopPropagation();

    setSearchSuggestion(false);
  };

  const showSearchSuggestion = () => {
    setSearchSuggestion(true);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>): void => {
    const element = e.currentTarget;
    const shouldFetchNextPage =
      Math.abs(
        element.scrollHeight - element.scrollTop - element.clientHeight,
      ) < 1 && topicPages?.hasNextPage;
    if (!shouldFetchNextPage) {
      handleFetchNextPage();
    }
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionRef.current &&
        event.target instanceof Node &&
        !suggestionRef.current.contains(event.target)
      ) {
        setSearchSuggestion(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <Form.Label required>{label}</Form.Label>
      <Controller
        name="section"
        control={methods.control}
        render={({ field }) => (
          <div
            className={`flex flex-row flex-wrap gap-1 ${
              field.value.length === 0 && '-mt-2'
            }`}
          >
            {field.value.map((id: number) => {
              const topic = getTopicById(id);
              return (
                <div
                  className="flex flex-row gap-1 rounded-full bg-primary-50 px-3 py-2"
                  key={topic?.id}
                >
                  <span
                    className={mergeClassnames(
                      'text-xs font-medium leading-4 text-[#F0F5FF] flex items-center justify-center',
                      'sm:text-sm leading-[14px]',
                    )}
                  >
                    {topic?.name}
                  </span>
                  <X
                    color="#fff"
                    onClick={() => handleRemove(topic?.id)}
                    className="cursor-pointer"
                  />
                </div>
              );
            })}
          </div>
        )}
      />
      <button
        className="relative z-10 outline-none"
        type="button"
        onClick={showSearchSuggestion}
      >
        <div className="flex h-10 cursor-pointer items-center rounded-2xl border-[1px] border-solid border-neutral-90 bg-neutral-98 p-3 text-sm leading-4 text-neutral-40">
          {placeholder}
        </div>
        <div
          className={mergeClassnames(
            `absolute z-10 flex w-2/3 flex-col items-start gap-1 rounded-lg bg-white p-2 shadow-lg ${
              !searchSuggestion && 'hidden'
            }`,
            'sm:w-1/2',
          )}
          ref={suggestionRef}
        >
          <input
            type="text"
            key="search-session"
            className="h-9 w-full rounded-2xl bg-[#F3F4F6] pl-8 pr-2 text-sm font-medium leading-4 text-neutral-20 outline-none"
            value={searchText}
            onChange={onChangeText}
            ref={(e) => e?.focus()}
          />
          <MagnifyingGlass className="absolute left-4 top-4 h-5 w-5" />
          <div
            className="max-h-32 w-full overflow-y-auto"
            ref={listRef}
            onScroll={handleScroll}
          >
            {isLoading || isFetching ? (
              <TopicSkeleton />
            ) : (
              topicPages?.data?.map((item: Topic, index: number) => (
                <div
                  className="flex w-full cursor-pointer p-2 text-sm font-medium leading-4 text-neutral-20 hover:bg-neutral-90"
                  aria-hidden="true"
                  onClick={(e) => handleAdd(e, item)}
                  key={index}
                >
                  {item?.name}
                </div>
              ))
            )}
          </div>
        </div>
      </button>
    </div>
  );
};

export default SearchSections;
