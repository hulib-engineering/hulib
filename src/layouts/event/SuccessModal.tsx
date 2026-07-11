'use client';

import Image from 'next/image';
import React from 'react';
import { useTranslations } from 'next-intl';

import Button from '@/components/core/button/Button';
import Modal from '@/components/Modal';
import { mergeClassnames } from '@/components/core/private/utils';

export type ISuccessFormModalProps = {
  name: string;
  open: boolean;
  onClose: () => void;
};

const SuccessFormModal = (props: ISuccessFormModalProps) => {
  const t = useTranslations('event');

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Modal.Backdrop />
      <Modal.Panel
        className={mergeClassnames('w-5/6 min-w-[345px] 2xl:min-w-[550px]')}
      >
        <div className={mergeClassnames(
          'flex w-full flex-col items-center justify-center rounded-[20px]',
          'bg-neutral-variant-98 bg-gradient-to-bl from-white/20 to-[#F9DA6C20] bg-blend-multiple',
        )}
        >
          <div className="flex min-h-[25.5rem] w-5/6 flex-col items-center justify-start py-20 lg:w-2/3">
            <div className="m-auto flex flex-col items-center justify-center gap-12">
              <Image
                alt="Illustration image"
                src="/assets/images/misc/success-illus.svg"
                priority
                width={450}
                height={400}
                className="object-contain"
              />
              <div className="flex flex-col gap-2 text-center">
                <p>
                  {t('success_modal.greeting')}
                  {' '}
                  <span className="font-bold">{props.name}</span>
                  ,
                </p>
                <p>{t('success_modal.confirmation')}</p>
                <p>{t('success_modal.thank_you')}</p>
                <p>{t('success_modal.reminder')}</p>
              </div>
              <div className="flex items-center justify-center">
                <Button type="button" onClick={props.onClose}>
                  {t('success_modal.close_button')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Modal.Panel>
    </Modal>
  );
};

export default SuccessFormModal;
