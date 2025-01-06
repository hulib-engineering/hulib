'use client';

import { useTranslations } from 'next-intl';
import React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { z } from 'zod';

import Button from '@/components/button/Button';
import Form from '@/components/form/Form';
import TextInput from '@/components/textInput/TextInput';

import SearchSession from './SearchSession';

interface Props {
  methods: UseFormReturn<
    {
      about: string;
      section: string[];
      education: string;
      from: number;
      to: number;
    },
    any,
    undefined
  >;
  onNextPress: (data: z.infer<any>) => void;
}

const HumanBookRegisterStep1 = (props: Props) => {
  const {
    methods: {
      register,
      handleSubmit,
      formState: { errors },
    },
    onNextPress,
  } = props;
  const t = useTranslations('HumanBookRegister');

  return (
    <Form
      className="flex flex-col gap-[33px]"
      onSubmit={handleSubmit(onNextPress)}
      id="next-step"
    >
      <Form.Item>
        <TextInput
          id="about"
          type="text-area"
          label={<Form.Label required>{t('About')}</Form.Label>}
          placeholder={t('placeholder_about')}
          {...register('about')}
          isError={!!errors.about}
          hintText={errors.about?.message}
          className="h-[162px] p-3 text-sm text-[#5C6063]"
        />
      </Form.Item>
      <SearchSession
        methods={props.methods}
        label={t('Session')}
        placeholder={t('searchSession')}
      />

      <div className="flex flex-row gap-6">
        <Form.Item>
          <TextInput
            id="education"
            type="text"
            label={<Form.Label required>{t('Education')}</Form.Label>}
            placeholder={t('placeholder_education')}
            {...register('education')}
            isError={!!errors.education}
            hintText={errors.education?.message}
            className="text-sm text-[#5C6063]"
          />
        </Form.Item>

        <div className="flex flex-row gap-3">
          <Form.Item>
            <TextInput
              id="from"
              type="number"
              label={<Form.Label required>{t('From')}</Form.Label>}
              placeholder={t('placeholder_from')}
              {...register('from', { valueAsNumber: true })}
              isError={!!errors.from}
              hintText={errors.from?.message}
              className="text-sm text-[#5C6063]"
            />
          </Form.Item>
          <Form.Item>
            <TextInput
              id="to"
              type="number"
              label={<Form.Label required>{t('To')}</Form.Label>}
              placeholder={t('placeholder_to')}
              {...register('to', { valueAsNumber: true })}
              isError={!!errors.to}
              hintText={errors.to?.message}
              className="text-sm text-[#5C6063]"
            />
          </Form.Item>
        </div>
      </div>

      <p className="text-sm font-normal leading-5 opacity-80">
        <u>{t('footer_description_underline')}</u> {t('footer_description')}
      </p>
      <Button type="submit" form="next-step" className="mt-[7px]">
        {t('Next')}
      </Button>
    </Form>
  );
};

export default HumanBookRegisterStep1;
