import type { InputProps } from './types';

const allowedCharactersValues = ['alpha', 'numeric', 'alphanumeric'] as const;

const propsMap: { [key: string]: InputProps } = {
  alpha: {
    type: 'text',
    inputMode: 'text',
    pattern: '[\\w]{1}',
  },
  alphanumeric: {
    type: 'text',
    inputMode: 'text',
    pattern: '[\\w\\d]{1}',
  },
  numeric: {
    type: 'tel',
    inputMode: 'numeric',
    pattern: '[0-9]{1}',
    min: '0',
    max: '9',
  },
};

export { allowedCharactersValues, propsMap };
