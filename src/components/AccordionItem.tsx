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
    <div className="flex w-full flex-col gap-4">
      <button
        onClick={() => setIsExpanding(!isExpanding)}
        type="button"
        className="flex w-full items-center justify-center rounded-xl bg-white px-6 py-4"
      >
        <span className="w-full text-start text-xl font-medium">{trigger}</span>
        <div className="flex h-8 w-8 min-w-8 items-center justify-center rounded-lg bg-light-hover">
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
              className={`origin-center rotate-90 transition duration-300 ease-in-out ${
                isExpanding && '!rotate-180'
              }`}
            />
          </svg>
        </div>
      </button>
      <div
        className={`grid transition-all duration-500 ease-in-out ${
          isExpanding
            ? 'grid-rows-[1fr] opacity-100'
            : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="overflow-hidden p-6 pt-0 text-base font-light">
            {content.heading !== '' && content.heading}
            <ul className="list-disc px-6">
              {content.bodyParams.map((each, index) => (
                <li key={index}>{each}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccordionItem;
