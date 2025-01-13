/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

'use client';

import { useTranslations } from 'next-intl';
import React from 'react';

import Button from '@/components/button/Button';
import Form from '@/components/form/Form';

import TextInput from '../textInput/TextInput';

interface Props {
  urlError: boolean;
  onGoBackPress: () => void;
  onRegisterPress: (url: string) => void;
}

const Step2 = (props: Props) => {
  const { urlError, onGoBackPress, onRegisterPress } = props;

  const [url, setURL] = React.useState<string>('');
  const t = useTranslations('HumanBookRegister');

  return (
    <div className="flex flex-col gap-[24px]">
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-col items-start justify-between">
          <Form.Label required>{t('introduction_video')}</Form.Label>
          <span className="mb-2 mt-6 text-base font-medium leading-5">
            {t('insert_url')}
          </span>
          <TextInput
            id="url"
            type="text"
            label={null}
            placeholder="https://"
            isError={urlError}
            hintText={t('validation.invalid_url')}
            onChange={(e) => setURL(e.target.value)}
            className="text-sm text-[#5C6063]"
          />
          <span className="mt-2 text-xs font-normal text-neutral-60">
            {t('supporting_text')}
          </span>
        </div>
      </div>
      <p className="text-base font-normal leading-5 opacity-80">
        <u>{t('footer_description_underline')}</u> {t('footer_description')}
      </p>
      <div className="mt-2 flex flex-row items-center gap-3">
        <Button onClick={onGoBackPress} variant="outline">
          {t('Back')}
        </Button>
        <Button
          type="button"
          form="human-book-register-form"
          className="flex-[1px]"
          onClick={() => onRegisterPress(url)}
        >
          {t('Register')}
        </Button>
      </div>
    </div>
  );
};

export default Step2;
