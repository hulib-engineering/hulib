type Size = 'sm' | 'md' | 'lg';

type ItemState = {
  size?: Size;
  disabled?: boolean;
  error?: boolean;
};

type FormState = {
  size?: Size;
};

export type { FormState, ItemState };
