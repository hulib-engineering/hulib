import React from 'react';

import { useFormItemContext } from './form/private/utils';
import { mergeClassnames } from './private/utils';

type HintProps = {
  error?: boolean;
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
};

const Hint = ({
  children,
  error: hintError,
  disabled,
  className,
}: HintProps) => {
  const { error: formItemError } = useFormItemContext('Hint');
  const error = hintError || formItemError;
  return (
    <p
      role="alert"
      className={mergeClassnames(
        'flex gap-1 items-center text-xs leading-[14px] [&_svg]:text-moon-16',
        error ? 'text-red-50' : 'text-neutral-60',
        disabled && 'opacity-60 cursor-not-allowed',
        className,
      )}
    >
      {children}
    </p>
  );
};

export default Hint;
