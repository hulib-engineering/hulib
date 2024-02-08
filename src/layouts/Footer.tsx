'use client';

import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

import { Logo } from '@/components/Logo';
import PrivacyPolicyModal from '@/components/PrivacyPolicyModal';
import { mergeClassnames } from '@/components/private/utils';
import TermOfUseModal from '@/components/TermOfUseModal';

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
    // <footer className="w-full border-t-[0.5px] border-t-[rgba(176,206,250,0.50)] py-4 lg:px-[20.625rem] lg:py-[5.625rem]">
    //   {/* <div className="flex w-full flex-col items-start justify-center gap-8"> */}
    //   <div className="flex w-full flex-col items-center justify-between gap-8 lg:flex-row">
    //     <div className="hidden lg:flex">
    //       <Logo />
    //     </div>
    //     <div className="flex lg:hidden">
    //       <LogoSmall />
    //     </div>
    //     <div className="flex flex-col-reverse items-center gap-8 lg:flex-row">
    //       <p className="text-sm font-normal leading-[1.375rem] text-[rgba(0,_87,_215,_0.50)]">
    //         {t('copyright')}
    //       </p>
    //       <div className="flex flex-col items-center gap-4 lg:flex-row">
    <>
      <footer
        className={mergeClassnames(
          'w-full border-t-[0.5px] border-t-[rgba(176,206,250,0.50)] px-4 py-3',
          'sm:border-none lg:px-[20.625rem] lg:py-[5.625rem]',
        )}
      >
        <div className="mx-auto flex w-full flex-col items-center justify-between sm:flex-row lg:max-w-7xl">
          <div className="hidden lg:flex">
            <Logo />
          </div>
          <div className="mb-8 flex lg:hidden">
            <Logo size="small" />
          </div>
          <div className="flex flex-col-reverse items-center justify-center gap-8 sm:flex-row sm:gap-6">
            {/* <div> */}
            <p className="text-sm font-normal text-[rgba(0,_87,_215,_0.50)]">
              {t('copyright')}
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
              {Links.map((link, index) => (
                <div key={index} className="mb-1">
                  <button
                    type="button"
                    onClick={() => handleClick(link.modalName)}
                    className={mergeClassnames(
                      'text-sm font-normal text-primary-hover/50 underline transition duration-200 capitalize',
                      'hover:-translate-y-1',
                    )}
                  >
                    {link.content}
                  </button>
                </div>
              ))}
            </div>
            {/* </div> */}
          </div>
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
      {/* <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}> */}
      {/*  <Modal.Backdrop /> */}
      {/*  <Modal.Panel className="w-[56.25rem]"> */}
      {/*    <PrivacyPolicy onClose={() => setIsModalOpen(false)} /> */}
      {/*  </Modal.Panel> */}
      {/* </Modal> */}
    </>
  );
};

export default Footer;
