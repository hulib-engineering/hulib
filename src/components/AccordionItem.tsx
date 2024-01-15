import React, { useState } from 'react';

interface AccordionItemProps {
  question: string;
  answer: string;
  font: string;
}
const AccordionItem: React.FC<AccordionItemProps> = ({
  question,
  answer,
  font,
}) => {
  const [accordionOpen, setAccordionOpen] = useState(false);
  return (
    <div className="flex w-full flex-col items-center gap-4 self-stretch rounded-xl px-6">
      <button
        onClick={() => setAccordionOpen(!accordionOpen)}
        type="button"
        className="flex w-full items-center justify-center rounded-xl bg-white px-6 py-4"
      >
        <span
          className={`${font} w-full text-start text-xl font-medium leading-[1.875rem] `}
        >
          {question}
        </span>
        <div className="flex h-[2rem] w-[2rem] min-w-[2rem] items-center justify-center rounded-lg bg-[#D9E7FD] ">
          <svg
            className="  fill-indigo-500"
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
                accordionOpen && '!rotate-180'
              }`}
            />
            <rect
              y="9"
              width="24"
              height="2"
              rx="1"
              className={`origin-center rotate-90 transition duration-300 ease-in-out ${
                accordionOpen && '!rotate-180'
              }`}
            />
          </svg>
        </div>
      </button>
      <div
        className={`grid  transition-all duration-500 ease-in-out ${
          accordionOpen
            ? 'grid-rows-[1fr] opacity-100'
            : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div
            className={`${font} overflow-hidden p-6 pt-0 text-base font-light leading-normal `}
          >
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccordionItem;
