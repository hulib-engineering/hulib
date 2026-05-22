import type { ReactNode } from 'react';

type SwitchProps = {
  'checked': boolean;
  'onChange': (checked: boolean) => void;
  'disabled'?: boolean;
  'className'?: string;
  'thumbClassName'?: string;
  'aria-label'?: string;
  /** Optional content rendered visually hidden inside the switch (e.g. screen reader label). */
  'srLabel'?: ReactNode;
};

export type { SwitchProps };
