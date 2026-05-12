import { createContext } from 'react';

export type AccountUpgradeStepContextValue = {
  currentStep: number;
  goToStep: (step: number) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  showSuccess: boolean;
  setShowSuccess: (value: boolean) => void;
};

export const AccountUpgradeStepContext = createContext<AccountUpgradeStepContextValue | null>(null);
