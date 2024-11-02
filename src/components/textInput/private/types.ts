import type { Size } from '@/components/private/types';

type TextInputSizeType = Size.SMALL | Size.MEDIUM | Size.LARGE;

type TextInputTypes =
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'number'
  | 'password'
  | 'search'
  | 'tel'
  | 'text'
  | 'time'
  | 'url';

export type { TextInputSizeType, TextInputTypes };
