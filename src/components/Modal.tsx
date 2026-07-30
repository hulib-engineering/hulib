import { Dialog, Transition } from '@headlessui/react';
import type { MutableRefObject, ReactElement, ReactNode } from 'react';
import React from 'react';

import Backdrop from './Backdrop';
import type { WithChildren } from '@/components/core/private/types';
import { mergeClassnames } from '@/components/core/private/utils';
import { poppins } from '@/styles/fonts';

type ModalRootProps = {
  open: boolean;
  onClose: () => void;
  initialFocus?: MutableRefObject<HTMLElement | null>;
  disableClosingTrigger?: boolean;
  className?: string;
};

type ModalComponentProps = (
  props: WithChildren<ModalRootProps>,
) => ReactElement | null;

const ModalRoot: ModalComponentProps = ({
  open,
  onClose,
  children,
  disableClosingTrigger,
  initialFocus,
}) => (
  <Transition appear show={open} as={React.Fragment}>
    <Dialog
      as="div"
      initialFocus={initialFocus}
      className={mergeClassnames(poppins.className, 'relative z-[1000]')}
      onClose={() => !disableClosingTrigger && onClose()}
    >
      {children}
    </Dialog>
  </Transition>
);

type PanelProps = {
  className?: string;
};
const Panel = ({ children, className }: WithChildren<PanelProps>) => (
  <div className="fixed inset-0 overflow-y-auto">
    <div className="flex min-h-full items-center justify-center p-4">
      <Transition.Child
        enter="transition duration-500 ease-in-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-200 ease-in"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
        as={React.Fragment}
      >
        <Dialog.Panel
          className={mergeClassnames(
            'w-full max-w-5xl inline-block transform rounded-3xl bg-white align-middle shadow-lg transition-all',
            className,
          )}
        >
          {children}
        </Dialog.Panel>
      </Transition.Child>
    </div>
  </div>
);

const Title = ({ children }: { children?: ReactNode }) => (
  <Dialog.Title as="h3" className="text-lg font-medium text-gray-900">
    {children}
  </Dialog.Title>
);

const Modal = Object.assign(ModalRoot, {
  Backdrop,
  Title,
  Panel,
});

export default Modal;
