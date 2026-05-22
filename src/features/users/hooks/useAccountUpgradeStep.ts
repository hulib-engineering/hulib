'use client';

import { useContext } from 'react';

import {
  AccountUpgradeStepContext,
  type AccountUpgradeStepContextValue,
} from '../context/AccountUpgradeStepContext';

export function useAccountUpgradeStep(): AccountUpgradeStepContextValue {
  const ctx = useContext(AccountUpgradeStepContext);
  if (!ctx) {
    throw new Error(
      'useAccountUpgradeStep must be used within AccountUpgradeLayout (step context provider)',
    );
  }
  return ctx;
}
