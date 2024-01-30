import { useTranslations } from 'next-intl';
import React from 'react';

import AccordionItem from '@/components/AccordionItem';

const FAQItems = [
  'faqs_question_0' as const,
  'faqs_question_1' as const,
  'faqs_question_2' as const,
];

const FAQs = () => {
  const t = useTranslations('Index');

  return (
    <section className="flex flex-col items-center justify-center py-8 text-slate-1000 lg:py-[5.625rem]">
      <div className="flex w-[23rem] flex-col items-center justify-center lg:w-4/12">
        <div className="mb-6 w-full text-center lg:mb-8">
          <h1 className="w-full text-[1.75rem] font-semibold md:text-4xl lg:text-5xl lg:font-bold">
            FAQs
          </h1>
        </div>
        <div className="flex w-full flex-col justify-center">
          {FAQItems.map((key, index) => (
            <AccordionItem
              key={index}
              trigger={t(`${key}.question`)}
              content={t(`${key}.answer`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQs;
