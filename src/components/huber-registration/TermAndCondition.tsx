import { useTranslations } from 'next-intl';
import React from 'react';

import {
  listMessageItem,
  newLineMessage,
  strongMessage,
  unorderedMessageList,
} from '@/utils/i18NRichTextUtils';

interface SectionProps {
  title?: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <div>
    {title && <h2 className="my-1 text-lg font-bold">{title}</h2>}
    <ul className="!my-0">{children}</ul>
  </div>
);

interface SubSectionProps {
  title: string;
  children: React.ReactNode;
}

const SubSection: React.FC<SubSectionProps> = ({ title, children }) => (
  <div>
    <h3 className="mb-1 font-semibold">{title}</h3>
    <ul className="!my-0">{children}</ul>
  </div>
);

const TermAndCondition = () => {
  const t = useTranslations('Index');

  return (
    <div className="flex h-[10rem] flex-col overflow-auto text-sm leading-5 text-neutral-40">
      <Section>
        {t.rich('community_guidelines_sections.index_0.content', {
          br: newLineMessage(),
          ul: unorderedMessageList('list-disc pl-6'),
          li: listMessageItem(),
          strong: strongMessage(),
        })}
      </Section>

      <Section title={t('community_guidelines_sections.index_1.heading')}>
        {t.rich('community_guidelines_sections.index_1.content', {
          br: newLineMessage(),
          ul: unorderedMessageList('list-disc pl-6'),
          li: listMessageItem(),
          strong: strongMessage(),
        })}
      </Section>

      <Section title={t('community_guidelines_sections.index_2.heading')}>
        <SubSection
          title={t(
            'community_guidelines_sections.index_2.content_sections.index_0.heading',
          )}
        >
          {t.rich(
            'community_guidelines_sections.index_2.content_sections.index_0.content',
            {
              br: newLineMessage(),
              ul: unorderedMessageList('list-disc pl-6'),
              li: listMessageItem(),
              strong: strongMessage(),
            },
          )}
        </SubSection>

        <SubSection
          title={t(
            'community_guidelines_sections.index_2.content_sections.index_1.heading',
          )}
        >
          {t.rich(
            'community_guidelines_sections.index_2.content_sections.index_1.content',
            {
              br: newLineMessage(),
              ul: unorderedMessageList('list-disc pl-6'),
              li: listMessageItem(),
              strong: strongMessage(),
            },
          )}
        </SubSection>

        <SubSection
          title={t(
            'community_guidelines_sections.index_2.content_sections.index_2.heading',
          )}
        >
          {t.rich(
            'community_guidelines_sections.index_2.content_sections.index_2.content',
            {
              br: newLineMessage(),
              ul: unorderedMessageList('list-disc pl-6'),
              li: listMessageItem(),
              strong: strongMessage(),
            },
          )}
        </SubSection>
      </Section>

      <Section title={t('community_guidelines_sections.index_3.heading')}>
        {t.rich('community_guidelines_sections.index_3.content', {
          br: newLineMessage(),
          ul: unorderedMessageList('list-disc pl-6'),
          li: listMessageItem(),
          strong: strongMessage(),
        })}
      </Section>
    </div>
  );
};

export default TermAndCondition;
