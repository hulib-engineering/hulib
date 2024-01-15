'use client';

import { Outfit } from 'next/font/google';
import React from 'react';

import AccordionItem from './AccordionItem';

const faqs = [
  {
    question: 'First question goes here?',
    answer:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolor libero ea non similique blanditiis distinctio ipsam dicta, veritatis fugiat aut sequi culpa ipsum quidem earum nam quod quia dolores nesciunt! Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolor libero ea non similique blanditiis distinctio ipsam dicta, veritatis fugiat aut sequi culpa ipsum quidem earum nam quod quia dolores nesciunt!',
  },
  {
    question: 'Second question goes here?',
    answer:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolor libero ea non similique blanditiis distinctio ipsam dicta, veritatis fugiat aut sequi culpa ipsum quidem earum nam quod quia dolores nesciunt!',
  },
  {
    question: 'Third question goes here?',
    answer:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolor libero ea non similique blanditiis distinctio ipsam dicta, veritatis fugiat aut sequi culpa ipsum quidem earum nam quod quia dolores nesciunt!',
  },
];
const outfit = Outfit({
  subsets: ['latin'],
});
const FAQs = (): JSX.Element => {
  return (
    // TODO remove bg
    <section className="flex flex-col items-center justify-center gap-8 self-stretch bg-slate-200 py-[5.625rem] text-[#002254]">
      <div className="flex w-full flex-col items-center gap-6">
        <h1
          className={`${outfit.className} w-full text-center text-5xl font-bold leading-[3.6rem] `}
        >
          FAQs
        </h1>
      </div>
      <div className="flex w-full flex-col items-start gap-4 self-stretch">
        {faqs.map((faq) => (
          <AccordionItem
            key={Math.floor(Math.random())}
            question={faq.question}
            answer={faq.answer}
            font={outfit.className}
          />
        ))}
      </div>
    </section>
  );
};

export default FAQs;
