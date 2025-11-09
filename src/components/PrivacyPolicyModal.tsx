import Link from 'next/link';
import { useTranslations } from 'next-intl';
import React from 'react';

import type { IPolicyModalProps } from '@/components/PolicyModal';
import PolicyModal from '@/components/PolicyModal';
import { Env } from '@/libs/Env.mjs';
import {
  customExternalLink,
  customInternalLink,
  customMessage,
  listMessageItem,
  newLineMessage,
  unorderedMessageList,
} from '@/utils/i18NRichTextUtils';

const PrivacyPolicyModal = ({
  open,
  onClose,
}: Omit<IPolicyModalProps, 'type'>) => {
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
    'index_9',
    'index_10',
  ] as const;

  const t = useTranslations('Index');

  return (
    <PolicyModal type="privacy-policy" open={open} onClose={onClose}>
      <p>
        {t.rich('privacy_policy_description', {
          important: customMessage('font-semibold text-gray-800'),
          br: newLineMessage(),
          linkTohHome: customInternalLink('/'),
          sendEmail: customExternalLink('mailto:hulibvietnam@gmail.com'),
        })}
      </p>
      <div className="w-full">
        <h2 className="mt-1 text-xl font-semibold text-gray-800">
          {t('privacy_policy_table_of_content.title')}
        </h2>
        <ul className="block list-none text-lp-primary-blue">
          {contentIndexes.map((index, i) => (
            <li key={index}>
              <Link href={`#privacy-policy-${i}`}>
                {t(`privacy_policy_table_of_content.${index}`)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {contentIndexes.map((index, i) => (
        <section key={index} id={`privacy-policy-${i}`}>
          <h2 className="mb-1 text-xl font-semibold text-gray-800">
            {t(`privacy_policy_sections.${index}.heading`)}
          </h2>
          <p>
            {t.rich(`privacy_policy_sections.${index}.content`, {
              br: newLineMessage(),
              ul: unorderedMessageList('list-disc pl-6'),
              li: listMessageItem(),
              important: customMessage('font-semibold text-gray-800'),
              sendEmail: customExternalLink(
                `mailto:${Env.NEXT_PUBLIC_CONTACT_EMAIL}`,
              ),
              call: customInternalLink(
                `tel:${Env.NEXT_PUBLIC_CONTACT_PHONE_NUMBER}`,
              ),
            })}
          </p>
        </section>
      ))}
    </PolicyModal>
  );
};

export default PrivacyPolicyModal;
