'use client';

import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

import PrivacyPolicyModal from '@/components/PrivacyPolicyModal';
import { mergeClassnames } from '@/components/private/utils';
import TermOfUseModal from '@/components/TermOfUseModal';
import { Env } from '@/libs/Env.mjs';

const SocialLinks = [
  {
    iconUrl: '/assets/images/icons/facebook.svg',
    link: 'https://www.facebook.com/hulibvietnam',
    name: 'Facebook',
  },
  {
    iconUrl: '/assets/images/icons/instagram.svg',
    link: 'https://www.instagram.com/hulibofficial?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
    name: 'Instagram',
  },
  {
    iconUrl: '/assets/images/icons/tiktok.svg',
    link: 'https://www.tiktok.com/@hulibvn?is_from_webapp=1&sender_device=pc',
    name: 'Tiktok',
  },
  {
    iconUrl: '/assets/images/icons/threads-icon.svg',
    link: 'https://www.threads.net/@hulibofficial?is_from_webapp=1&sender_device=pc',
    name: 'Threads',
  },
];

const Footer = () => {
  const t = useTranslations('Footer');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModalRef, setCurrentModalRef] = useState('');

  const handleClick = (modalName: string) => {
    setIsModalOpen(true);
    setCurrentModalRef(modalName);
  };

  const Links = [
    { content: t('privacy_policy'), modalName: 'privacy_policy' },
    { content: t('term_of_service'), modalName: 'term_of_service' },
  ];

  return (
    <>
      <footer
        className={mergeClassnames(
          'mx-auto w-full px-4 pt-8 pb-6 text-lp-primary-blue',
          'lg:w-3/4 lg:px-8 2xl:px-[5.625rem] 2xl:pt-[5.625rem] 2xl:pb-10',
        )}
      >
        <div
          className={mergeClassnames(
            'mx-auto mb-3 flex w-full flex-col items-start justify-between border-t-[0.5px] border-t-solid border-t-[rgba(176,206,250,0.50)] py-8 gap-8',
            'sm:flex-row sm:gap-0 lg:mb-12 lg:max-w-7xl lg:py-20',
          )}
        >
          <div className="flex w-full flex-col items-center gap-8 sm:items-start">
            <h4 className="text-2xl font-semibold ">Help</h4>
            <div className="flex flex-col items-center gap-4 sm:items-start">
              {Links.map((link, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleClick(link.modalName)}
                  className={mergeClassnames(
                    'text-sm font-normal transition duration-200 capitalize',
                    'hover:-translate-y-1 hover:text-primary-hover',
                  )}
                >
                  {link.content}
                </button>
              ))}
            </div>
          </div>
          <div className="flex w-full flex-col items-center gap-8 sm:items-start">
            <h4 className="text-center text-2xl font-semibold">Contact</h4>
            <div className="flex flex-col items-center gap-4 text-sm sm:items-start">
              <Link
                href={`tel:${Env.NEXT_PUBLIC_CONTACT_PHONE_NUMBER}`}
                className="flex items-center justify-center hover:text-primary-hover"
              >
                <PhoneIcon width={24} height={24} />
                <p className="ml-3 text-sm font-normal">
                  {Env.NEXT_PUBLIC_CONTACT_PHONE_NUMBER}
                </p>
              </Link>
              <Link
                href={`mailto:${Env.NEXT_PUBLIC_CONTACT_EMAIL}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center hover:text-primary-hover"
              >
                <EnvelopeIcon width={24} height={24} />
                <p className="ml-3 text-sm font-normal">
                  {Env.NEXT_PUBLIC_CONTACT_EMAIL}
                </p>
              </Link>
            </div>
          </div>
          <div className="flex w-full flex-col items-center gap-8">
            <h4 className="text-left text-2xl font-semibold">Follow us</h4>
            <div className="flex w-full items-center justify-center gap-8">
              {SocialLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.link}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary-hover"
                >
                  <Image
                    src={link.iconUrl}
                    alt={link.name}
                    width={24}
                    height={24}
                    loading="lazy"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between border-t-[0.5px] border-solid border-t-[rgba(176,206,250,0.50)] px-0 py-6">
          <p className="text-sm font-normal text-[rgba(0,_87,_215,_0.50)]">
            {t('copyright')}
          </p>
        </div>
      </footer>
      {currentModalRef === 'privacy_policy' && (
        <PrivacyPolicyModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      {currentModalRef === 'term_of_service' && (
        <TermOfUseModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default Footer;
