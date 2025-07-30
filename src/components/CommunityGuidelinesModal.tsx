import { useTranslations } from 'next-intl';
import React from 'react';

import type { IPolicyModalProps } from '@/components/PolicyModal';
import PolicyModal from '@/components/PolicyModal';
import {
  listMessageItem,
  newLineMessage,
  strongMessage,
  unorderedMessageList,
} from '@/utils/i18NRichTextUtils';

const CommunityGuidelinesModal = ({
  open,
  onClose,
}: Omit<IPolicyModalProps, 'type'>) => {
  const contentIndexes = ['index_0', 'index_1', 'index_2', 'index_3'] as const;

  const t = useTranslations('Index');

  return (
    <PolicyModal type="community-guidelines" open={open} onClose={onClose}>
      {contentIndexes.map((index, i) => (
        <section
          className="w-full"
          key={index}
          id={`community-guidelines-${i}`}
        >
          <h2 className="mb-1 text-xl font-semibold uppercase text-gray-800">
            {t(`community_guidelines_sections.${index}.heading`)}
          </h2>
          {index !== 'index_2' && (
            <div>
              {t.rich(`community_guidelines_sections.${index}.content`, {
                br: newLineMessage(),
                ul: unorderedMessageList('list-disc pl-6'),
                li: listMessageItem(),
                strong: strongMessage(),
              })}
            </div>
          )}
          {index === 'index_2'
          && ['index_0' as const, 'index_1' as const, 'index_2' as const].map(
            each => (
              <div key={each} className="mb-3 last:mb-0">
                <h3 className="mb-1 text-lg font-semibold text-gray-800">
                  {t(
                    `community_guidelines_sections.index_2.content_sections.${each}.heading`,
                  )}
                </h3>
                <div>
                  {t.rich(
                    `community_guidelines_sections.index_2.content_sections.${each}.content`,
                    {
                      br: newLineMessage(),
                      ul: unorderedMessageList('list-disc pl-6'),
                      li: listMessageItem(),
                      strong: strongMessage(),
                    },
                  )}
                </div>
              </div>
            ),
          )}
        </section>
      ))}
    </PolicyModal>
  );
};

export default CommunityGuidelinesModal;
