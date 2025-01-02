/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

'use client';

import { CaretLeft } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import React from 'react';

import Button from '@/components/button/Button';
import Form from '@/components/form/Form';

import FileUpload from './Upload';

interface Props {
  onGoBackPress: () => void;
  onRegisterPress: (file: File | null) => void;
}

const MentorRegisterStep2 = (props: Props) => {
  const { onGoBackPress, onRegisterPress } = props;
  const t = useTranslations('MentorRegister');
  const [file, setFile] = React.useState<File | null>(null);

  return (
    <div className="flex flex-col gap-[33px]">
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-row items-center justify-between">
          <Form.Label required>{t('introduction_video')}</Form.Label>
          {file && (
            <p
              className="cursor-pointer text-red-50 underline"
              onClick={() => setFile(null)}
            >
              {t('delete_selected_video')}
            </p>
          )}
        </div>
        <FileUpload onChange={(value) => setFile(value)} value={file} />
      </div>
      <p className="text-base font-normal leading-5 opacity-80">
        <u>{t('footer_description_underline')}</u> {t('footer_description')}
      </p>
      <div className="mt-4 flex flex-row items-center gap-3">
        <Button
          onClick={onGoBackPress}
          variant="outline"
          iconLeft={<CaretLeft />}
        >
          {t('Back')}
        </Button>
        <Button
          type="button"
          form="mentor-register-form"
          className="flex-[1px]"
          onClick={() => onRegisterPress(file)}
        >
          {t('Register')}
        </Button>
      </div>
    </div>
  );
};

export default MentorRegisterStep2;
