'use client';

import Image from 'next/image';
import React from 'react';

const SearchInput = () => {
  const [searchText, setSearchText] = React.useState<string>('');

  return (
    <div className="w-full">
      <div className="relative rounded-xl border-[1px] border-solid border-neutral-90 bg-neutral-98 shadow-sm">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search by keyword"
          className="w-full rounded-lg bg-transparent px-3 py-[9.5px] text-sm text-neutral-40 outline-none"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <Image
            src="/assets/images/icons/search.svg"
            width={24}
            height={24}
            loading="lazy"
            alt="Search Icon"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchInput;
