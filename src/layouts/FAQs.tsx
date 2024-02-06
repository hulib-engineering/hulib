import { useTranslations } from 'next-intl';
import React from 'react';

import AccordionItem from '@/components/AccordionItem';

const FAQItemList = [
  {
    key: 'faqs_question_0' as const,
    bodyParas: ['p1', 'p2', 'p3'] as const,
  },
  {
    key: 'faqs_question_1' as const,
    bodyParas: ['p1'] as const,
  },
  {
    key: 'faqs_question_2' as const,
    bodyParas: ['p1', 'p2'] as const,
  },
];

const FAQs = () => {
  const t = useTranslations('Index');

  return (
    <section className="flex flex-col items-center justify-center py-[5.625rem] text-slate-1000">
      <div className="flex w-4/12 flex-col items-center justify-center">
        <div className="mb-8 w-full text-center">
          <h1 className="w-full text-5xl font-bold">FAQs</h1>
        </div>
        <div className="flex w-full flex-col justify-center">
          {FAQItemList.map((item, index) => (
            <AccordionItem
              key={index}
              trigger={t(`${item.key}.question`)}
              content={{
                heading: t(`${item.key}.answer.heading`),
                bodyParams: item.bodyParas.map((paraIndex) =>
                  // @ts-ignore
                  t(`${item.key}.answer.body_paras.${paraIndex}`),
                ),
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQs;
