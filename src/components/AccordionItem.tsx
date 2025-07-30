'use client';

import React, { useState } from 'react';

const AccordionItem = ({
  trigger,
  content,
}: {
  trigger: string;
  content: { heading: string; bodyParams: string[] };
}) => {
  const [isExpanding, setIsExpanding] = useState(false);

  return (
    <div className="flex w-full flex-col">
      <button
        onClick={() => setIsExpanding(!isExpanding)}
        type="button"
        className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-6 py-4"
      >
        <span className="w-full text-wrap text-start text-base font-medium lg:text-xl">
          {trigger}
        </span>
        <div className="flex size-8 items-center justify-center rounded-lg bg-light-hover">
          <svg
            className="fill-indigo-500"
            width="20"
            height="20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              y="9"
              width="24"
              height="2"
              rx="1"
              className={`origin-center transition duration-300 ease-in-out ${
                isExpanding && '!rotate-180'
              }`}
            />
            <rect
              y="9"
              width="24"
              height="2"
              rx="1"
              className={`origin-center transition duration-300 ease-in-out rotate-90 ${
                isExpanding && '!rotate-180'
              }`}
            />
          </svg>
        </div>
      </button>
      <div
        className={`grid transition-all duration-500 ease-in-out ${
          isExpanding
            ? 'mt-4 grid-rows-[1fr] opacity-100'
            : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden px-6 pt-0 text-sm font-light lg:text-base">
          {content.heading !== '' && content.heading}
          <ul className="list-disc px-6">
            {content.bodyParams.map((each, index) => (
              <li key={index}>{each}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AccordionItem;
