'use client';

import type { ChangeEvent } from 'react';
import React, { useState } from 'react';

const CTAform = (): JSX.Element => {
  const [email, setEmail] = useState<string>('');
  const handleClick = (): void => {
    // TODO handle new letter
    setEmail('');
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
  };
  return (
    <form className="relative flex h-[4.5rem] w-full flex-row items-center justify-center gap-4 self-stretch rounded-[3.125rem] bg-white pr-3">
      <input
        title="Email"
        placeholder="Email Address*"
        className="h-full w-full rounded-[3.125rem_0_0_3.125rem] pl-7 text-xl outline-none"
        onChange={handleChange}
        value={email}
      />
      <button
        type="button"
        onClick={handleClick}
        className="h-[3rem] items-center justify-center rounded-[2rem] bg-[#0061EF] px-8 py-3 text-base
        font-medium leading-6 text-white transition-all duration-300 ease-out hover:bg-[#0056d6]"
      >
        SUBSCRIBE
      </button>
    </form>
  );
};

export default CTAform;
