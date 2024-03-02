'use client';

import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

import { Logo } from '@/components/Logo';
import PrivacyPolicyModal from '@/components/PrivacyPolicyModal';
import { mergeClassnames } from '@/components/private/utils';
import TermOfUseModal from '@/components/TermOfUseModal';

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
  // { iconUrl: '/assets/images/icons/linked-in.svg', link: '', name: 'Linkedin' },
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
    // { content: t('cookie_settings'), modalName: 'cookie_settings' },
  ];

  return (
    <>
      <footer
        className={mergeClassnames(
          'w-full border-t-[0.5px] border-t-[rgba(176,206,250,0.50)] px-4 py-3 text-primary',
          'sm:border-none lg:px-28 2xl:px-[20.625rem] 2xl:pt-[5.625rem] 2xl:pb-10',
        )}
      >
        <div
          className={mergeClassnames(
            'mx-auto mb-12 flex w-full flex-row items-start justify-between border-t-[0.5px] border-solid border-blue-light-active',
            'sm:flex-row lg:max-w-7xl lg:py-20',
          )}
        >
          <div className="flex flex-col items-center gap-6 lg:items-start">
            <div>
              <div className="hidden lg:flex">
                <Logo />
              </div>
              <div className="mb-8 block sm:mb-0 lg:hidden">
                <Logo size="small" />
              </div>
            </div>
            <div className="w-96">
              <p className="text-center text-base font-light lg:text-start">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse varius enim in eros elementum tristique. Duis
                cursus, mi quis viverra ornare.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-8 lg:items-start">
            <h4 className="text-2xl font-semibold ">Help</h4>
            <div className="flex flex-col items-center gap-4 lg:items-start">
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
          <div className="flex flex-col items-center gap-8 lg:items-start">
            <h4 className="text-center text-2xl font-semibold">Contact</h4>
            <div className="flex flex-col items-center gap-4 lg:items-start">
              <Link
                href="tel:0707565362"
                className="flex items-center justify-center hover:text-primary-hover"
              >
                <PhoneIcon width={24} height={24} />
                <p className="ml-3 text-sm font-normal">(+84) 123 456 789</p>
              </Link>
              <Link
                href="mailto:jooie020998@gmail.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-3 hover:text-primary-hover"
              >
                <EnvelopeIcon width={24} height={24} />
                <p className="ml-3 text-sm font-normal">EmailHulib@gmail.com</p>
              </Link>
            </div>
          </div>
          <div className="flex flex-col items-center gap-8 lg:items-start">
            <h4 className="text-2xl font-semibold">Follow us</h4>
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
        <div className="flex flex-col items-center justify-between border-t-[0.5px] border-solid border-blue-light-active px-0 py-6">
          <p className="text-sm font-normal text-[rgba(0,_87,_215,_0.50)]">
            {t('copyright')}
          </p>
          {/* <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4"> */}
          {/*  {Links.map((link, index) => ( */}
          {/*    <div key={index} className="mb-1"> */}
          {/*      <button */}
          {/*        type="button" */}
          {/*        onClick={() => handleClick(link.modalName)} */}
          {/*        className={mergeClassnames( */}
          {/*          'text-sm font-normal text-primary-hover/50 underline transition duration-200 capitalize', */}
          {/*          'hover:-translate-y-1', */}
          {/*        )} */}
          {/*      > */}
          {/*        {link.content} */}
          {/*      </button> */}
          {/*    </div> */}
          {/*  ))} */}
          {/* </div> */}
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
