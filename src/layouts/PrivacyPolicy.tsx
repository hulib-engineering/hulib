import { XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import React, { type ReactNode } from 'react';

import Button from '@/components/button/Button';
import { newLineMessage } from '@/components/InfoContainer';
import { mergeClassnames } from '@/components/private/utils';
import { customMessage } from '@/layouts/Hero';
import { Env } from '@/libs/Env.mjs';

export const unorderedMessageList = (listStyle: string): (() => ReactNode) => {
  // eslint-disable-next-line react/display-name
  return (...chunks: ReactNode[]): ReactNode => {
    return <ul className={listStyle}>{chunks}</ul>;
  };
};

export const listMessageItem = (): (() => ReactNode) => {
  // eslint-disable-next-line react/display-name
  return (...chunks: ReactNode[]): ReactNode => {
    return <li>{chunks}</li>;
  };
};

export const customInternalLink = (href: string): (() => ReactNode) => {
  // eslint-disable-next-line react/display-name
  return (...chunks: ReactNode[]): ReactNode => {
    return (
      <Link href={href} className="text-primary">
        {chunks}
      </Link>
    );
  };
};

export const customExternalLink = (href: string): (() => ReactNode) => {
  // eslint-disable-next-line react/display-name
  return (...chunks: ReactNode[]): ReactNode => {
    return (
      <Link
        href={href}
        className="text-primary"
        target="_blank"
        rel="noreferrer"
      >
        {chunks}
      </Link>
    );
  };
};

// const InfoList = [
//   {
//     key: 'about_stories' as const,
//     image: {
//       src: '/assets/images/visual.png',
//       position: 'left' as const,
//     },
//   },
//   {
//     key: 'about_mission' as const,
//     image: {
//       src: '/assets/images/visual-1.png',
//       position: 'right' as const,
//     },
//   },
//   {
//     key: 'about_vision' as const,
//     image: {
//       src: '/assets/images/visual-2.png',
//       position: 'left' as const,
//     },
//   },
// ];

const PrivacyPolicy = ({ onClose }: { onClose: () => void }) => {
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
    <div className="flex w-full flex-col items-center justify-center gap-12 rounded-3xl bg-white p-12">
      <div className="inline-flex w-full items-center justify-between">
        <Image
          alt="HULIB minified logo"
          src="/assets/images/minified-HULIB-logo.png"
          width={36}
          height={42}
          className="object-contain"
          loading="eager"
        />
        <h1 className="text-[28px] font-semibold capitalize text-slate-1000">
          {t('privacy_policy_title')}
        </h1>
        <button type="button" onClick={onClose}>
          <XMarkIcon width={24} height={24} />
        </button>
      </div>
      <div
        className={mergeClassnames(
          'custom-scrollbar scroll-smooth mb-8 flex h-[25.5rem] flex-col items-center justify-start gap-6 overflow-y-scroll',
          'text-base font-normal leading-snug text-gray-400',
        )}
      >
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
          <ul className="block list-none text-primary">
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
      </div>
      <div className="inline-flex w-full items-center justify-end">
        <Button
          className="rounded-full capitalize shadow-[0px_8px_24px_#1979ff40] transition-all duration-300 hover:translate-y-0.5 hover:shadow-none"
          onClick={onClose}
        >
          accept
        </Button>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
