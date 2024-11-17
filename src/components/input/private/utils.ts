import type InputProps from './types';

const getMaxDate = (type?: InputProps['type']): string | undefined => {
  switch (type) {
    case 'date':
      return '9999-12-31';
    case 'datetime-local':
      return '9999-12-31T23:59';
    default:
      return undefined;
  }
};

const getSizeStyles = (size?: InputProps['size']): string => {
  switch (size) {
    case 'lg':
      return 'h-12 leading-[3rem] rounded-moon-i-sm input-lg-dt-shared';
    case 'sm':
      return 'h-8 leading-8 rounded-moon-i-xs input-dt-shared';
    default:
      return 'h-10 leading-10 rounded-moon-i-sm input-dt-shared';
  }
};

const getTypeStyles = (type?: InputProps['type']): string | undefined => {
  switch (type) {
    case 'number':
      return 'input-number-clear';
    case 'date':
      return 'ltr:input-d rtl:input-d-rtl';
    case 'time':
      return 'ltr:input-t rtl:input-t-rtl';
    case 'datetime-local':
      return 'ltr:input-d rtl:input-dt-local-rtl';
    default:
      return undefined;
  }
};

export default getTypeStyles;

export { getMaxDate, getSizeStyles, getTypeStyles };
