'use client';

import { Outfit } from 'next/font/google';
import type { ChangeEvent } from 'react';
import React, { useState } from 'react';

const outfit = Outfit({
  subsets: ['latin'],
});
const CTA = (): JSX.Element => {
  const [email, setEmail] = useState<string>('');
  const handleClick = (): void => {
    // TODO handle new letter
    console.log(email);
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
  };
  return (
    <section
      className={`${outfit.className} flex w-full flex-col items-center justify-center gap-20 self-stretch bg-gray-200 px-[2rem] py-[6.25rem] text-[#002254]`}
    >
      <div className="flex flex-col items-center justify-center gap-8 self-stretch rounded-[2rem] border-4 border-solid border-white  bg-[rgba(255,_255,_255,_0.50)] px-0 py-[5.625rem] backdrop-blur-[50px]">
        <div className="flex flex-col items-center gap-6 self-stretch ">
          <p className="!my-0 text-center text-lg font-semibold uppercase leading-[1.6875rem]">
            join with us
          </p>
          <h1 className="text-center text-5xl font-bold leading-[3.6rem]">
            Become Our Sponsor To Support Young People Together
          </h1>
        </div>
        <form className="relative flex h-[4.5rem] w-full flex-row items-center justify-center gap-4 self-stretch rounded-[3.125rem] bg-white pr-3">
          <input
            title="email"
            placeholder="Email Address*"
            className="h-full w-full rounded-[3.125rem_0_0_3.125rem] pl-7 text-xl outline-none"
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={handleClick}
            className="h-[3rem] items-center justify-center rounded-[2rem] bg-[#0061EF] px-8 py-3 text-base font-medium leading-6 text-white"
          >
            SUBSCRIBE
          </button>
        </form>
      </div>
    </section>
  );
};

export default CTA;
