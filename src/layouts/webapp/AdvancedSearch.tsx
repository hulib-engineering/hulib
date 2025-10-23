'use client';

import { ClockCounterClockwise, X } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import React, { type ReactNode, useEffect, useMemo, useState } from 'react';

import MenuItem from '@/components/core/menuItem/MenuItem';
import Search, { searchFilterItems, searchGetItemIndex } from '@/components/core/search/Search';
import { mergeClassnames } from '@/components/core/private/utils';

type Item = {
  children?: ReactNode;
  id: string;
};
type Items = {
  items: Item[];
  heading?: string;
  id: string;
};

export default function AdvancedSearch() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [qString, setQString] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      return;
    }

    // Update local storage
    const updatedHistory = [...searchHistory, query];
    const uniqueHistory = Array.from(new Set(updatedHistory)).slice(-6);
    setSearchHistory(uniqueHistory);
    localStorage.setItem('searchHistory', JSON.stringify(uniqueHistory));

    // Navigate and close dropdown
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setQString(query);
    setOpen(false);
  };

  const filteredHistoryItems = useMemo(
    () =>
      searchFilterItems(
        [
          {
            heading: 'Recent search',
            id: 'history',
            items: searchHistory.map(search => ({
              id: search,
              children: search,
              onClick: () => handleSearch(search), // reuse unified handler
            })),
          },
        ],
        qString,
      ),
    [handleSearch, qString, searchHistory],
  );

  const handleDeleteSearch = (
    e: React.MouseEvent,
    searchToDelete: string,
  ) => {
    e.stopPropagation();

    const updatedHistory = searchHistory.filter(
      item => item !== searchToDelete,
    );

    setSearchHistory(updatedHistory);

    if (qString === searchToDelete) {
      router.push(`/search?q=`);
      setQString('');
    }

    if (updatedHistory.length > 0) {
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    } else {
      localStorage.removeItem('searchHistory');
      setOpen(false);
    }
  };

  return (
    <Search
      isOpen={open}
      search={qString}
      onChangeSearch={setQString}
      onChangeOpen={setOpen}
      className={mergeClassnames(open && 'w-full lg:w-[317px]')}
    >
      <Search.Input
        className={mergeClassnames(
          open && 'mt-2 mx-2 rounded-2xl bg-neutral-variant-90 border-neutral-variant-90',
        )}
      >
        <Search.Input.Input
          placeholder="Search by keyword"
          onKeyDown={e => e.key === 'Enter' && handleSearch(qString)}
        />
        {!open && <Search.Input.Icon />}
      </Search.Input>
      <Search.Transition>
        <Search.Result className="bg-neutral-98">
          {filteredHistoryItems.length
            ? (
                filteredHistoryItems.map((list: Items) => (
                  <ul className="space-y-1" key={list.id}>
                    <li>
                      <Search.ResultHeading className="bg-white p-2">{list.heading}</Search.ResultHeading>
                      {list.items.map(({ id, children, ...rest }: Item) => (
                        <Search.ResultItem
                          key={id}
                          index={searchGetItemIndex(filteredHistoryItems, id)}
                          closeOnSelect
                          className="rounded-lg bg-white"
                          {...rest}
                        >
                          <MenuItem>
                            <ClockCounterClockwise className="text-xl text-primary-60" />
                            <MenuItem.Title>{children}</MenuItem.Title>
                            <X
                              className="cursor-pointer text-xl text-[#343330]"
                              onClick={e => handleDeleteSearch(e, children as string)}
                            />
                          </MenuItem>
                        </Search.ResultItem>
                      ))}
                    </li>
                  </ul>
                ))
              )
            : (
                <Search.NoResults />
              )}
        </Search.Result>
      </Search.Transition>
    </Search>
  );
};
