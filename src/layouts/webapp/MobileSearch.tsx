'use client';

import { MagnifyingGlass, TrendUp, X } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';

import { mergeClassnames } from '@/components/core/private/utils';
import { useRouter } from '@/libs/i18nNavigation';

// Popular search keywords (static suggestions shown in the mobile search panel)
const POPULAR_KEYWORDS = ['Human Library', 'Kể chuyện', 'Sách sống', 'Trải nghiệm'];

const MobileSearch = () => {
  const router = useRouter();
  const t = useTranslations('Common');

  const [open, setOpen] = useState(false);
  const [qString, setQString] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    if (open) {
      // Focus the search input when the panel opens
      inputRef.current?.focus();
    } else {
      setQString('');
    }
  }, [open]);

  const saveHistory = (query: string) => {
    const updatedHistory = Array.from(new Set([...searchHistory, query])).slice(-6);
    setSearchHistory(updatedHistory);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
  };

  const handleSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }

    saveHistory(trimmed);
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    setQString(trimmed);
    setOpen(false);
  };

  const handleDeleteHistory = (e: React.MouseEvent, itemToDelete: string) => {
    e.stopPropagation();

    const updatedHistory = searchHistory.filter(item => item !== itemToDelete);
    setSearchHistory(updatedHistory);

    if (updatedHistory.length > 0) {
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    } else {
      localStorage.removeItem('searchHistory');
    }
  };

  return (
    <>
      {/* Closed state: magnifying glass icon button in the navbar row */}
      {!open && (
        <button
          type="button"
          aria-label={t('search_by_keyword')}
          className="rounded-[100px] p-2 text-[#343330] hover:bg-neutral-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-60"
          onClick={() => setOpen(true)}
        >
          <MagnifyingGlass className="text-[24px]" />
        </button>
      )}

      {/* Open state: full-width search panel with popular searches & recent history */}
      {open && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close search"
          className="fixed inset-0 z-[999] bg-[#2E3032]/50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setOpen(false);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setOpen(false);
            }
          }}
        >
          <div className="absolute inset-x-0 top-0 bg-white px-4 pb-5 pt-4 shadow-[0_8px_18px_-1px_#1C1E2124,_0_0_4px_0_#0F0F1014]">
            {/* Search input */}
            <form
              className="flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch(qString);
              }}
            >
              <div className="flex h-11 flex-1 items-center gap-2 rounded-full bg-neutral-variant-98 px-4 outline outline-1 outline-neutral-variant-90 focus-within:outline-2 focus-within:outline-primary-80">
                <input
                  ref={inputRef}
                  type="text"
                  autoComplete="off"
                  value={qString}
                  onChange={e => setQString(e.currentTarget.value)}
                  placeholder={t('search_by_keyword')}
                  aria-label={t('search_by_keyword')}
                  className="w-full border-0 bg-transparent text-sm leading-4 text-neutral-10 placeholder-neutral-40 focus:outline-none focus:ring-0"
                />
                {qString && (
                  <button
                    type="button"
                    aria-label="Clear"
                    className="shrink-0 text-neutral-30 hover:text-neutral-10"
                    onClick={() => setQString('')}
                  >
                    <X className="text-xl" />
                  </button>
                )}
              </div>
              <button
                type="button"
                aria-label="Close search"
                className="rounded-[100px] p-2 text-[#343330] hover:bg-neutral-90"
                onClick={() => setOpen(false)}
              >
                <X className="text-2xl" />
              </button>
            </form>

            {/* Popular search */}
            <div className="mt-5 flex flex-col gap-3">
              <span className="text-sm font-medium leading-4 text-neutral-20">
                {t('popular_search')}
              </span>
              <ul className="flex flex-wrap gap-2">
                {POPULAR_KEYWORDS.map(keyword => (
                  <li key={keyword}>
                    <button
                      type="button"
                      className={mergeClassnames(
                        'flex items-center gap-1.5 rounded-full bg-neutral-variant-98 px-3 py-2',
                        'text-sm leading-4 text-neutral-10 hover:bg-neutral-variant-90',
                      )}
                      onClick={() => handleSearch(keyword)}
                    >
                      <TrendUp className="text-base text-primary-60" />
                      {keyword}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent search */}
            {searchHistory.length > 0 && (
              <div className="mt-5 flex flex-col gap-3">
                <span className="text-sm font-medium leading-4 text-neutral-20">
                  {t('recent_search')}
                </span>
                <ul className="flex flex-col gap-1">
                  {searchHistory.map(item => (
                    <li key={item}>
                      <div
                        role="button"
                        tabIndex={0}
                        className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-neutral-90"
                        onClick={() => handleSearch(item)}
                        onKeyDown={e => e.key === 'Enter' && handleSearch(item)}
                      >
                        <span className="text-sm leading-4 text-neutral-10">{item}</span>
                        <X
                          className="cursor-pointer text-lg text-[#343330]"
                          onClick={e => handleDeleteHistory(e, item)}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MobileSearch;
