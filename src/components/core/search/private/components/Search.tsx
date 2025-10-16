import { Transition as HeadlessTransition } from '@headlessui/react';
import type {
  HTMLAttributes,
  KeyboardEvent,
  MutableRefObject,
  ReactNode,
} from 'react';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import type { SearchProps } from '../types';
import { SearchContext, SelectContext } from '../utils/context';
import { Input } from './Input';
import NoResults from './NoResults';
import ResultItem from './ResultItem';
import useClickOutside from '@/libs/hooks/useClickOutside';
import { mergeClassnames } from '@/components/core/private/utils';

const SearchRoot = ({
  selected: selectedParent,
  onChangeOpen,
  onChangeSearch,
  onChangeSelected,
  search,
  children,
  isOpen,
  className,
}: SearchProps) => {
  const isParentSelected
    = typeof selectedParent === 'number' && onChangeSelected;

  const inputRef = useRef<MutableRefObject<HTMLInputElement>>(null);

  const [selected, setSelected] = useState(0);

  const [ref, hasClickedOutside] = useClickOutside();

  const handleChangeSelected = (direction?: 'up' | 'down') => {
    const items = document.querySelectorAll('.search-list-item');

    const selectedValue = isParentSelected ? selectedParent : selected;

    let index = 0;
    let newIndex = 0;

    if (direction === 'down') {
      items.forEach((_, i) => {
        if (i === selectedValue) {
          index = i;
        }
      });

      newIndex = index === items.length - 1 ? 0 : index + 1;
    } else if (direction === 'up') {
      items.forEach((_, i) => {
        if (i === selectedValue) {
          index = i;
        }
      });

      newIndex = !index ? items.length - 1 : index - 1;
    } else if (isParentSelected) {
      onChangeSelected(0);
    } else {
      setSelected(0);
    }

    const newItem = items[newIndex];

    if (newItem) {
      if (isParentSelected) {
        onChangeSelected(newIndex);
      } else {
        setSelected(newIndex);
      }
      newItem.scrollIntoView({
        behavior: 'smooth',
        block: newIndex ? 'center' : 'end',
      });
    }
  };
  const handleSelect = () => {
    const items = document.querySelectorAll('.search-list-item') as NodeListOf<
      HTMLButtonElement | HTMLAnchorElement
    >;
    const selectedValue = isParentSelected ? selectedParent : selected;

    let index = 0;

    items.forEach((_, i) => {
      if (i === selectedValue) {
        index = i;
      }
    });

    const item = items[index];

    if (item) {
      item.click();
      if (
        item.attributes.getNamedItem('data-close-on-select')?.value === 'true'
      ) {
        onChangeOpen(false);
      }
    }
  };

  useEffect(() => {
    handleChangeSelected();
  }, [search]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (
        e.key === 'ArrowDown'
        || (e.ctrlKey && e.key === 'n')
        || (e.ctrlKey && e.key === 'j')
      ) {
        e.preventDefault();
        e.stopPropagation();
        handleChangeSelected();
      } else if (
        e.key === 'ArrowUp'
        || (e.ctrlKey && e.key === 'p')
        || (e.ctrlKey && e.key === 'k')
      ) {
        e.preventDefault();
        e.stopPropagation();
        handleChangeSelected();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        handleSelect();
      }
    },
    [handleChangeSelected, handleSelect],
  );

  useEffect(() => {
    if (hasClickedOutside) {
      onChangeOpen(false);
    }
  });

  const searchValues = useMemo(
    () => ({ search, onChangeOpen, onChangeSearch, inputRef, isOpen }),
    [search, onChangeOpen, onChangeSearch, inputRef, isOpen],
  );
  const selectValues = useMemo(() => ({ selected }), [selected]);

  // const openSearch = useCallback(() => onChangeOpen(true), []);

  return (
    <div className="relative">
      {isOpen && (
        <div
          role="button" // announce as interactive
          tabIndex={0} // focusable via keyboard
          aria-label="Close overlay"
          className="fixed inset-0 z-[998] bg-[#2E3032]/50"
          onClick={() => onChangeOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape' || e.key === 'Enter') {
              e.preventDefault();
              e.stopPropagation(); // ✅ add this
              onChangeOpen(false);
            }
          }}
        />
      )}

      <div className="relative z-[999] mx-auto w-full max-w-md transition-all">
        <div
          ref={ref}
          role="button"
          tabIndex={0}
          onKeyDown={onKeyDown}
        >
          <div
            role="button" // announce as interactive
            tabIndex={0} // focusable via keyboard
            className={mergeClassnames(
              'relative size-full flex flex-col transition-all',
              isOpen
                ? 'rounded-t-2xl bg-neutral-98'
                : 'rounded-2xl outline outline-1 outline-neutral-variant-90 bg-neutral-variant-98 hover:bg-neutral-variant-90',
              search.trim().length > 0 && 'outline-2 outline-primary-80',
              className,
            )}
            onClick={() => {
              // Only open if the click is on input, not on the results
              if (!isOpen) {
                onChangeOpen(true);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation(); // ✅ stop bubbling to parent
                if (!isOpen) {
                  onChangeOpen(true);
                }
              }
            }}
          >
            <SearchContext.Provider value={searchValues}>
              <SelectContext.Provider value={selectValues}>
                {children}
              </SelectContext.Provider>
            </SearchContext.Provider>
          </div>
        </div>
      </div>
    </div>
  );
};

const Transition = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const { isOpen } = useContext(SearchContext);

  return (
    <HeadlessTransition
      show={isOpen}
      as="div"
      enter="ease-out duration-300"
      enterFrom="opacity-0 scale-95"
      enterTo="opacity-100 scale-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-95"
      className={mergeClassnames('search-transition z-[999]', className)}
    >
      {children}
    </HeadlessTransition>
  );
};

const Result = ({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  const { isOpen } = useContext(SearchContext);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={mergeClassnames(
        'search-result',
        'absolute w-full rounded-b-2xl p-2 flex-1 bg-white shadow-[0_8px_18px_-1px_#1C1E2124,_0_0_4px_0_#0F0F1014] focus:outline-none',
        isOpen && 'pt-0 shadow-none',
        className,
      )}
      tabIndex={-1}
      {...props}
    >
      {children}
    </div>
  );
};

const ResultHeading = ({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) => (
  <h5
    className={mergeClassnames(
      ' rounded-lg px-3 py-1 text-neutral-10 text-sm leading-4 font-medium',
      className,
    )}
    {...props}
  >
    {children}
  </h5>
);

const Search = Object.assign(SearchRoot, {
  Input,
  NoResults,
  Transition,
  Result,
  ResultItem,
  ResultHeading,
});

export default Search;
