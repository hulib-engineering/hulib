'use client';

import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

import { Logo } from '@/components/Logo';
import Modal from '@/components/Modal';
import { mergeClassnames } from '@/components/private/utils';
import PrivacyPolicy from '@/layouts/PrivacyPolicy';

const Footer = () => {
  const t = useTranslations('Footer');

  const [isModalOpen, setIsModalOpen] = useState(false);

  const Links = [
    { content: t('privacy_policy'), modalName: 'privacy_policy' },
    { content: t('term_of_service'), modalName: 'term_of_service' },
    { content: t('cookie_settings'), modalName: 'cookie_settings' },
  ];

  return (
    <>
      <footer className="w-full px-[20.625rem] py-[5.625rem]">
        <div className="flex w-full items-center justify-between">
          <Logo />
          <div className="flex gap-6">
            <p className="text-sm font-normal leading-[1.375rem] text-[rgba(0,_87,_215,_0.50)]">
              {t('copyright')}
            </p>
            {Links.map((link, index) => (
              <div key={index}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className={mergeClassnames(
                    'text-sm font-normal leading-[1.375rem] text-[rgba(0,_87,_215,_0.50)] underline transition duration-200 capitalize',
                    'hover:-translate-y-1',
                  )}
                >
                  {link.content}
                </button>
              </div>
            ))}
          </div>
        </div>
      </footer>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Backdrop />
        <Modal.Panel className="w-[56.25rem]">
          <PrivacyPolicy onClose={() => setIsModalOpen(false)} />
        </Modal.Panel>
      </Modal>
    </>
  );
};

export default Footer;
