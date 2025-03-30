'use client';

import { X } from '@phosphor-icons/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React from 'react';

const SearchInput = () => {
  const [searchText, setSearchText] = React.useState<string>('');
  const [searchHistory, setSearchHistory] = React.useState<string[]>([]);
  const [showHistory, setShowHistory] = React.useState<boolean>(false);
  const t = useTranslations('HeaderWebApp');
  const router = useRouter();

  React.useEffect(() => {
    const savedSearches = localStorage.getItem('searchHistory');
    if (savedSearches) {
      setSearchHistory(JSON.parse(savedSearches));
    }
  }, []);

  const handleSearch = () => {
    // if (searchText.trim() === '') return;

    const updatedHistory = [...searchHistory, searchText];

    const uniqueSearches = [...new Set(updatedHistory)];
    const limitedSearches = uniqueSearches.slice(-10);

    setSearchHistory(limitedSearches);
    localStorage.setItem('searchHistory', JSON.stringify(limitedSearches));
    router.push(`/research?keyword=${searchText}`);
    setShowHistory(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSelectHistory = (search: string) => {
    setSearchText(search);
    setShowHistory(false);
    router.push(`/research?keyword=${search}`);
  };

  const handleClickOutside = () => {
    setShowHistory(false);
  };

  const handleClear = () => {
    setSearchHistory([]);
    setSearchText('');
    localStorage.removeItem('searchHistory');
    router.push(`/research?keyword=`);
  };

  const handleDeleteSearch = (
    e: React.MouseEvent | React.KeyboardEvent,
    searchToDelete: string,
  ) => {
    e.stopPropagation();

    const updatedHistory = searchHistory.filter(
      (item) => item !== searchToDelete,
    );

    setSearchHistory(updatedHistory);

    if (searchText === searchToDelete) {
      router.push(`/research?keyword=`);
      setSearchText('');
    }

    if (updatedHistory.length > 0) {
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    } else {
      localStorage.removeItem('searchHistory');
      setShowHistory(false);
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative z-10 rounded-xl border-neutral-90 bg-neutral-98 shadow-sm">
        <input
          type="text"
          value={searchText}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onFocus={() => searchHistory.length > 0 && setShowHistory(true)}
          placeholder={t('search_by_keyword')}
          className="w-full rounded-2xl bg-transparent px-3 py-[9.5px] text-sm text-neutral-40 outline-none focus:border-[4px] focus:border-solid focus:border-[#009BEE]"
        />
        <div
          className="absolute right-4 top-1/2 cursor-pointer -translate-y-1/2"
          onClick={handleSearch}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleSearch();
            }
          }}
          role="button"
          tabIndex={0}
        >
          <Image
            src="/assets/images/icons/search.svg"
            width={24}
            height={24}
            loading="lazy"
            alt="Search Icon"
          />
        </div>
      </div>

      {showHistory && searchHistory.length > 0 && (
        <div className="absolute top-full z-20 mt-1 w-full">
          <div className="w-full rounded-lg bg-white pb-3 pt-6 shadow-md">
            <div className="flex flex-row items-center justify-between px-[0.625rem]">
              <h3 className="text-sm font-medium leading-4 text-[#73787C]">
                {t('recent_searches')}
              </h3>
              <div
                className="cursor-pointer text-[0.625rem] leading-3 underline"
                onClick={handleClear}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleClear();
                  }
                }}
                role="button"
                tabIndex={0}
              >
                {t('clear')}
              </div>
            </div>
            <div className="mt-[0.625rem]">
              {searchHistory.map((search) => (
                <div
                  key={search}
                  className="flex flex-row items-center justify-between rounded p-2 px-[0.625rem] hover:bg-neutral-98"
                  onClick={() => handleSelectHistory(search)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleSelectHistory(search);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <p className="text-[0.875rem] font-medium leading-4">
                    {search}
                  </p>
                  <div
                    className="cursor-pointer"
                    onClick={(e) => handleDeleteSearch(e, search)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleDeleteSearch(e, search);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Delete ${search} from search history`}
                  >
                    <X color="#033599" fontSize={16} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showHistory && (
        <div
          className="fixed inset-0 z-10"
          onClick={handleClickOutside}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleClickOutside();
            }
          }}
          role="button"
          tabIndex={0}
        />
      )}
    </div>
  );
};

export default SearchInput;
