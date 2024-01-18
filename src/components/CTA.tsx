import { Poppins } from 'next/font/google';
import React from 'react';

import CTAform from './CTAform';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
});
const CTA = (): JSX.Element => {
  return (
    <section
      className={`${poppins.className} flex w-full flex-col items-center justify-center gap-20 self-stretch bg-gray-500 px-[17.5rem] py-[6.25rem] text-[#002254]`}
    >
      {/* add backdrop-blur can cause fps drop in low-end devices backdrop-blur-[50px] */}
      <div className="flex w-[78.75rem]  justify-center rounded-[2rem] border-4 border-solid border-white  bg-[rgba(255,_255,_255,_0.50)] ">
        <div className="flex w-[43.75rem] flex-col items-center justify-center gap-8 self-stretch  px-0 py-[5.625rem] ">
          <div className="flex flex-col items-center gap-6 self-stretch ">
            <p className="!my-0 text-center text-lg font-semibold uppercase leading-[1.6875rem]">
              join with us
            </p>
            <h1 className="text-center text-5xl font-bold leading-[3.6rem]">
              Become Our Sponsor To Support Young People Together
            </h1>
          </div>
          <CTAform />
        </div>
      </div>
    </section>
  );
};

export default CTA;
