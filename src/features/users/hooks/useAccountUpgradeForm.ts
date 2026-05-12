'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import type { Resolver } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import type { AccountUpgradeValidationType } from '@/validations/AccountUpgradeValidation';
import { AccountUpgradeValidation } from '@/validations/AccountUpgradeValidation';

type HumanBookRegisterT = ReturnType<typeof useTranslations<'HumanBookRegister'>>;
type HuberStep1TranslatorArg = Parameters<
  typeof import('@/validations/HuberValidation').HuberStep1Validation
>[0];

export function useAccountUpgradeForm(t: HumanBookRegisterT) {
  const schema = useMemo(
    () => AccountUpgradeValidation(t as HuberStep1TranslatorArg),
    [t],
  );

  const form = useForm<AccountUpgradeValidationType>({
    resolver: zodResolver(schema) as Resolver<AccountUpgradeValidationType>,
    mode: 'onSubmit',
    defaultValues: {
      bio: '',
      videoUrl: '',
      topics: [],
      isConfirmed: false,
      timeSlots: [],
    },
  });

  const getStepFields = (
    stepIndex: number,
  ): (keyof AccountUpgradeValidationType)[] => {
    switch (stepIndex) {
      case 0:
        return ['bio', 'videoUrl', 'topics', 'isConfirmed'];
      case 1:
        return ['timeSlots'];
      case 2:
        return [];
      default:
        return [];
    }
  };

  return { form, getStepFields };
}
