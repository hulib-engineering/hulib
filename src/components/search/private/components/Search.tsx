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
import { mergeClassnames } from '@/components/private/utils';

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

  const openSearch = useCallback(() => onChangeOpen(true), []);

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div ref={ref} onKeyDown={onKeyDown} onClick={openSearch}>
      <div
        className={mergeClassnames(
          'relative w-full h-full border border-neutral-90 flex flex-col transition-all',
          isOpen
            ? 'border-none rounded-t-2xl bg-white shadow-[0_8px_18px_-1px_#1C1E2124,_0_0_4px_0_#0F0F1014]'
            : 'rounded-2xl bg-neutral-98',
          className,
        )}
      >
        <SearchContext.Provider value={searchValues}>
          <SelectContext.Provider value={selectValues}>
            {children}
          </SelectContext.Provider>
        </SearchContext.Provider>
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
      'text-neutral-10 text-sm font-medium pl-1 pt-1',
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
