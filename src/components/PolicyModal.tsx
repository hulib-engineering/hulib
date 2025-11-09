import { XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import React from 'react';

import Button from '@/components/core/button/Button';
import Modal from '@/components/Modal';
import type { WithChildren } from '@/components/core/private/types';
import { mergeClassnames } from '@/components/core/private/utils';

export type IPolicyModalProps = {
  type: string;
  open: boolean;
  onClose: () => void;
};

const PolicyModal = (props: WithChildren<IPolicyModalProps>) => {
  const t = useTranslations('Index');

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Modal.Backdrop />
      <Modal.Panel className="w-[56.25rem]">
        <div className="flex w-full flex-col items-center justify-center gap-12 rounded-3xl bg-white p-6 md:p-12">
          <div className="inline-flex w-full items-center justify-between">
            <Image
              alt="HULIB minified logo"
              src="/assets/images/minified-HULIB-logo.png"
              width={36}
              height={42}
              className="hidden object-contain xl:block"
              loading="eager"
            />
            <h1 className="hidden text-[28px] font-semibold capitalize text-slate-1000 xl:block">
              {props.type === 'privacy-policy'
                ? t('privacy_policy_title')
                : props.type === 'community-guidelines'
                  ? t('community_guidelines_title')
                  : t('term_of_use_title')}
            </h1>
            <h6 className="text-xl font-medium capitalize leading-7 text-neutral-10 xl:hidden">
              {props.type === 'privacy-policy'
                ? t('privacy_policy_title')
                : props.type === 'community-guidelines'
                  ? t('community_guidelines_title')
                  : t('term_of_use_title')}
            </h6>
            <button type="button" className="hidden xl:flex" onClick={props.onClose}>
              <XMarkIcon width={24} height={24} />
            </button>
          </div>
          <div
            className={mergeClassnames(
              'custom-scrollbar scroll-smooth mb-8 flex h-[25.5rem] flex-col items-center justify-start gap-6 overflow-y-scroll',
              'text-base font-normal leading-snug text-gray-400',
            )}
          >
            {props.children}
          </div>
          <div className="inline-flex w-full items-center justify-end">
            <Button
              className="rounded-full capitalize shadow-[0px_8px_24px_#1979ff40] transition-all duration-300 hover:shadow-none hover:translate-y-0.5"
              onClick={props.onClose}
            >
              {t('txt_accept')}
            </Button>
          </div>
        </div>
      </Modal.Panel>
    </Modal>
  );
};

export default PolicyModal;
