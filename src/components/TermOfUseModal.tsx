import Link from 'next/link';
import { useTranslations } from 'next-intl';
import React from 'react';

import type { IPolicyModalProps } from '@/components/PolicyModal';
import PolicyModal from '@/components/PolicyModal';
import {
  customInternalLink,
  listMessageItem,
  newLineMessage,
  strongMessage,
  unorderedMessageList,
} from '@/utils/i18NRichTextUtils';

const TermOfUseModal = ({ open, onClose }: Omit<IPolicyModalProps, 'type'>) => {
  const contentIndexes = [
    'index_0',
    'index_1',
    'index_2',
    'index_3',
    'index_4',
    'index_5',
    'index_6',
    'index_7',
    'index_8',
  ] as const;

  const t = useTranslations('Index');

  return (
    <PolicyModal type="term-of-use" open={open} onClose={onClose}>
      <div className="w-full">
        <h2 className="text-xl font-semibold text-gray-800">
          {t('term_of_use_table_of_content.title')}
        </h2>
        <ul className="block list-none uppercase text-primary-50">
          {contentIndexes.map((index, i) => (
            <li key={index}>
              <Link href={`#term-of-use-${i}`}>
                {t(`term_of_use_table_of_content.${index}` as any)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {contentIndexes.map((index, i) => (
        <section key={index} id={`term-of-use-${i}`}>
          <h2 className="mb-1 text-xl font-semibold uppercase text-gray-800">
            {t(`term_of_use_sections.${index}.heading`)}
          </h2>
          {index !== 'index_4' &&
            index !== 'index_6' &&
            index !== 'index_7' && (
              <p>
                {t.rich(`term_of_use_sections.${index}.content`, {
                  br: newLineMessage(),
                  ul: unorderedMessageList('list-disc pl-6'),
                  li: listMessageItem(),
                  linkToPrivacy: customInternalLink('#privacy-policy-0'),
                  strong: strongMessage(),
                })}
              </p>
            )}
          {index === 'index_4' &&
            [
              'index_0' as const,
              'index_1' as const,
              'index_2' as const,
              'index_3' as const,
            ].map((each) => (
              <div key={each} className="mb-3 last:mb-0">
                <h3 className="mb-1 text-lg font-semibold text-gray-800">
                  {t(
                    `term_of_use_sections.index_4.content_sections.${each}.heading`,
                  )}
                </h3>
                <p>
                  {t.rich(
                    `term_of_use_sections.index_4.content_sections.${each}.content`,
                    {
                      br: newLineMessage(),
                      ul: unorderedMessageList('list-none'),
                      li: listMessageItem(),
                    },
                  )}
                </p>
              </div>
            ))}
          {index === 'index_6' &&
            ['index_0' as const, 'index_1' as const].map((each) => (
              <div key={each} className="mb-3 last:mb-0">
                <h3 className="mb-1 text-lg font-semibold text-gray-800">
                  {t(
                    `term_of_use_sections.index_6.content_sections.${each}.heading`,
                  )}
                </h3>
                <p>
                  {t.rich(
                    `term_of_use_sections.index_6.content_sections.${each}.content`,
                    {
                      br: newLineMessage(),
                      ul: unorderedMessageList('list-none'),
                      li: listMessageItem(),
                    },
                  )}
                </p>
              </div>
            ))}
          {index === 'index_7' &&
            ['index_0' as const, 'index_1' as const].map((each) => (
              <div key={each} className="mb-3 last:mb-0">
                <h3 className="mb-1 text-lg font-semibold text-gray-800">
                  {t(
                    `term_of_use_sections.index_7.content_sections.${each}.heading`,
                  )}
                </h3>
                <p>
                  {t.rich(
                    `term_of_use_sections.index_7.content_sections.${each}.content`,
                    {
                      br: newLineMessage(),
                      ul: unorderedMessageList('list-none'),
                      li: listMessageItem(),
                    },
                  )}
                </p>
              </div>
            ))}
        </section>
      ))}
    </PolicyModal>
  );
};

export default TermOfUseModal;
