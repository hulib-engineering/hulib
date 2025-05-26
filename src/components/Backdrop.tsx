import { Transition } from '@headlessui/react';
import React from 'react';

import { mergeClassnames } from '@/components/private/utils';

const Backdrop = ({
  className,
  onClose,
}: {
  className?: string;
  onClose?: () => void;
}) => (
  <Transition.Child
    as={React.Fragment}
    enter="ease-out duration-300 transition-opacity"
    enterFrom="opacity-0"
    enterTo="opacity-100"
    leave="ease-in duration-200 transition-opacity"
    leaveFrom="opacity-100"
    leaveTo="opacity-0"
  >
    <div
      className={mergeClassnames('fixed -z-1 inset-0 bg-black/70', className)}
      aria-hidden="true"
      onClick={onClose}
    />
  </Transition.Child>
);

export default Backdrop;
