'use client';

import { MagnifyingGlass, X } from '@phosphor-icons/react/dist/ssr';
import React, { useRef } from 'react';
import { Controller, type UseFormReturn } from 'react-hook-form';

import Form from '@/components/form/Form';

interface Props {
  methods: UseFormReturn<
    {
      about: string;
      section: string[];
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

const items = ['Maketing', 'Maketing Planner', 'Maketing Stategy'];

const SearchSections = (props: Props) => {
  const { methods, label, placeholder } = props;
  const [searchText, setSearchText] = React.useState('');
  const [searchSuggestion, setSearchSuggestion] = React.useState(false);
  const suggestionRef = useRef<HTMLDivElement | null>(null);

  const handleRemove = (value: string) => {
    const section = methods.getValues('section');
    const removedSection = section.filter((item) => item !== value);

    methods.setValue('section', removedSection);
  };

  const onChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const handleAdd = (
    event: React.MouseEvent<HTMLDivElement>,
    value: string,
  ) => {
    const section = methods.getValues('section');
    const isExisted = section.find((item) => item === value);

    if (!isExisted) {
      methods.setValue('section', [...section, value]);
    }
    event.stopPropagation();

    setSearchSuggestion(false);
  };

  const showSearchSuggestion = () => {
    setSearchSuggestion(true);
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
            {field.value.map((item: string, index: number) => (
              <div
                className="flex flex-row gap-1 rounded-full bg-primary-50 px-3 py-2"
                key={index}
              >
                <span className="text-sm font-medium leading-4 text-white">
                  {item}
                </span>
                <X
                  color="#fff"
                  onClick={() => handleRemove(item)}
                  className="cursor-pointer"
                />
              </div>
            ))}
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
          className={`absolute z-10 flex w-1/2 flex-col items-start gap-1 rounded-lg bg-white p-2 shadow-lg ${
            !searchSuggestion && 'hidden'
          }`}
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
          {searchText.length !== 0 &&
            items.map((item, index) => (
              <div
                className="flex w-full cursor-pointer p-2 text-sm font-medium leading-4 text-neutral-20 hover:bg-neutral-90"
                aria-hidden="true"
                onClick={(e) => handleAdd(e, item)}
                key={index}
              >
                {item}
              </div>
            ))}
        </div>
      </button>
    </div>
  );
};

export default SearchSections;
