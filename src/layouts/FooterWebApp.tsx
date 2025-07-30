'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import React, { Fragment, useState } from 'react';

import CommunityGuidelinesModal from '@/components/CommunityGuidelinesModal';
import { Logo } from '@/components/Logo';
import PrivacyPolicyModal from '@/components/PrivacyPolicyModal';
import TermOfUseModal from '@/components/TermOfUseModal';
import { Env } from '@/libs/Env.mjs';
import { useDeviceType } from '@/libs/hooks';

const socialLinks = [
  {
    iconUrl: '/assets/images/icons/facebook.svg',
    link: 'https://www.facebook.com/hulibvietnam',
    name: 'Facebook',
  },
  {
    iconUrl: '/assets/images/icons/instagram.svg',
    link: 'https://www.instagram.com/hulibvn/',
    name: 'Instagram',
  },
  {
    iconUrl: '/assets/images/icons/tiktok.svg',
    link: 'https://www.tiktok.com/@hulibvn?is_from_webapp=1&sender_device=pc',
    name: 'Tiktok',
  },
  {
    iconUrl: '/assets/images/icons/threads-icon.svg',
    link: 'https://www.threads.com/@hulibvn?igshid=NTc4MTIwNjQ2YQ%3D%3D',
    name: 'Threads',
  },
];

type FooterSection = {
  title: string;
  items: Partial<{
    title: string;
    iconUrl: string;
    href: string;
    modalName?: string;
  }>[];
};

const FooterWebApp = () => {
  const t = useTranslations('FooterWebApp');
  const { deviceType } = useDeviceType();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModalRef, setCurrentModalRef] = useState('');

  const handleClick = (modalName: string) => {
    setIsModalOpen(true);
    setCurrentModalRef(modalName);
  };

  const [footerSections] = React.useState<FooterSection[]>([
    {
      title: t('site'),
      items: [
        { title: t('my_schedule'), href: '/schedule-meeting/weekly-schedule' },
        { title: t('books'), href: '/explore-story' },
        { title: t('profile'), href: '/profile' },
      ],
    },
    {
      title: t('help'),
      items: [
        { title: t('privacy_policy'), modalName: 'privacy_policy' },
        { title: t('term_of_service'), modalName: 'term_of_service' },
        { title: t('community_guidelines'), modalName: 'community_guidelines' },
        // { title: t('cookie_settings') },
      ],
    },
    {
      title: t('contact'),
      items: [
        {
          iconUrl: '/assets/images/icons/phone.svg',
          title: Env.NEXT_PUBLIC_CONTACT_PHONE_NUMBER,
          href: `tel:${Env.NEXT_PUBLIC_CONTACT_PHONE_NUMBER}`,
        },
        {
          iconUrl: '/assets/images/icons/mail.svg',
          title: Env.NEXT_PUBLIC_CONTACT_EMAIL,
          href: `mailto:${Env.NEXT_PUBLIC_CONTACT_EMAIL}`,
        },
      ],
    },
  ]);

  if (deviceType === 'desktop') {
    return (
      <>
        <footer className="w-full">
          <div className="flex w-full flex-col justify-between rounded-md bg-white px-4 py-8 md:px-28 md:py-12 lg:flex-row">
            <div className="flex flex-col gap-6">
              <Logo size="small" />
              <p className="w-full text-center text-base font-medium leading-6 text-neutral-30 sm:text-left md:w-[340px]">
                {t('footer_description')}
              </p>
              <div className="flex flex-row justify-center gap-5 sm:justify-start">
                {socialLinks.map(link => (
                  <Link
                    key={link.name}
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
            <div className="grid grid-cols-1 sm:grid-cols-3">
              {footerSections.map(section => (
                <div
                  className="mt-16 flex w-fit flex-col gap-5 lg:mt-0"
                  key={section.title}
                >
                  <h4 className="text-xl font-medium leading-7 text-lp-primary-blue">
                    {section.title.toUpperCase()}
                  </h4>
                  <div className="flex flex-col gap-6">
                    {section.items.map((item) => {
                      if (item.modalName) {
                        return (
                          <button
                            key={item.title}
                            type="button"
                            onClick={() => handleClick(item.modalName!)}
                            className="flex cursor-pointer flex-row items-center gap-2 text-left leading-5"
                          >
                            {item?.iconUrl && (
                              <Image
                                src={item?.iconUrl}
                                alt={item.title || 'Icon'}
                                height={14}
                                width={18}
                                loading="lazy"
                                className="mb-px"
                              />
                            )}
                            <p className="text-base font-medium text-neutral-30">
                              {item.title}
                            </p>
                          </button>
                        );
                      }

                      const Wrapper: any = item?.href ? Link : 'div';
                      return (
                        <Wrapper
                          key={item.title}
                          className="flex cursor-pointer flex-row items-center gap-2 leading-5"
                          {...(item.href
                            ? {
                                href: item.href as any,
                                rel: 'noreferrer',
                              }
                            : {})}
                        >
                          {item?.iconUrl && (
                            <Image
                              src={item?.iconUrl}
                              alt={item.title || 'Icon'}
                              height={14}
                              width={18}
                              loading="lazy"
                              className="mb-px"
                            />
                          )}

                          <p className="text-base font-medium text-neutral-30">
                            {item.title}
                          </p>
                        </Wrapper>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="border-t border-solid border-neutral-90 bg-white py-5 text-center text-sm leading-4 text-neutral-30">
            Copyright © 2025 HuLib Website. All rights reserved.
          </p>
        </footer>

        {/* Conditional Modal Rendering */}
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
        {currentModalRef === 'community_guidelines' && (
          <CommunityGuidelinesModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </>
    );
  }

  return (
    <>
      <footer className="w-full">
        <div className="flex w-full flex-col justify-between rounded-md bg-white px-4 py-8 md:px-28 md:py-12 lg:flex-row">
          <div className="flex flex-col gap-6">
            <Logo size="small" />
            <p className="w-full text-start text-base font-medium leading-6 text-neutral-30 sm:text-left md:w-[340px]">
              {t('footer_description')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3">
            {footerSections.map((section, index) => (
              <Fragment key={section.title}>
                {index === footerSections.length - 1 && (
                  <div className="mt-16 flex w-fit flex-col gap-4 lg:mt-0">
                    <h4 className="text-xl font-medium leading-7 text-lp-primary-blue">
                      {t('join_our_social_community')}
                    </h4>
                    <div className="flex flex-row gap-5">
                      {socialLinks.map(link => (
                        <Link
                          key={link.name}
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
                )}
                <div
                  className="mt-16 flex w-fit flex-col gap-5 lg:mt-0"
                  key={section.title}
                >
                  <h4 className="text-xl font-medium leading-7 text-lp-primary-blue">
                    {section.title.toUpperCase()}
                  </h4>
                  <div className="flex flex-col gap-6">
                    {section.items.map((item) => {
                      if (item.modalName) {
                        return (
                          <button
                            key={item.title}
                            type="button"
                            onClick={() => handleClick(item.modalName!)}
                            className="flex cursor-pointer flex-row items-center gap-2 text-left leading-5"
                          >
                            {item?.iconUrl && (
                              <Image
                                src={item?.iconUrl}
                                alt={item.title || 'Icon'}
                                height={14}
                                width={18}
                                loading="lazy"
                                className="mb-px"
                              />
                            )}
                            <p className="text-base font-medium text-neutral-30">
                              {item.title}
                            </p>
                          </button>
                        );
                      }

                      const Wrapper: any = item?.href ? Link : 'div';
                      return (
                        <Wrapper
                          key={item.title}
                          className="flex cursor-pointer flex-row items-center gap-2 leading-5"
                          {...(item.href
                            ? {
                                href: item.href as any,
                                rel: 'noreferrer',
                              }
                            : {})}
                        >
                          {item?.iconUrl && (
                            <Image
                              src={item?.iconUrl}
                              alt={item.title || 'Icon'}
                              height={14}
                              width={18}
                              loading="lazy"
                              className="mb-px"
                            />
                          )}

                          <p className="text-base font-medium text-neutral-30">
                            {item.title}
                          </p>
                        </Wrapper>
                      );
                    })}
                  </div>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center border-t border-solid border-neutral-90 bg-white py-5">
          <p className="w-3/4 text-center text-sm leading-4 text-neutral-30">
            {t('copy_right')}
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
      {currentModalRef === 'community_guidelines' && (
        <CommunityGuidelinesModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default FooterWebApp;
