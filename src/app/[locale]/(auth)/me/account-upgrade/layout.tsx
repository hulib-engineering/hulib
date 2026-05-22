'use client';

import type { ReactNode } from 'react';
import { useCallback, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { FormProvider } from 'react-hook-form';

import {
  AccountUpgradeStepContext,
  type AccountUpgradeStepContextValue,
} from '@/features/users/context/AccountUpgradeStepContext';
import { useAccountUpgradeForm } from '@/features/users/hooks/useAccountUpgradeForm';

export default function AccountUpgradeLayout({ children }: { children: ReactNode }) {
  const t = useTranslations('HumanBookRegister');
  const { form } = useAccountUpgradeForm(t);

  const [currentStep, setCurrentStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  const goToNextStep = useCallback(() => {
    setCurrentStep(s => s + 1);
  }, []);

  const goToPreviousStep = useCallback(() => {
    setCurrentStep(s => Math.max(0, s - 1));
  }, []);

  const stepContextValue = useMemo(
    (): AccountUpgradeStepContextValue => ({
      currentStep,
      goToStep,
      goToNextStep,
      goToPreviousStep,
      showSuccess,
      setShowSuccess,
    }),
    [currentStep, showSuccess, goToStep, goToNextStep, goToPreviousStep],
  );

  return (
    <AccountUpgradeStepContext.Provider value={stepContextValue}>
      <FormProvider {...form}>{children}</FormProvider>
    </AccountUpgradeStepContext.Provider>
  );
}
