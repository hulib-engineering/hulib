import { Dialog, Transition } from '@headlessui/react';
import type { ReactNode } from 'react';
import React from 'react';

import Backdrop from '@/components/Backdrop';
import type { WithChildren } from '@/components/private/types';
import { mergeClassnames } from '@/components/private/utils';

type ModalRootProps = {
  open: boolean;
  onClose: () => void;
};

type ModalComponentProps = (
  props: WithChildren<ModalRootProps>,
) => React.ReactElement | null;

const ModalRoot: ModalComponentProps = ({ open, onClose, children }) => (
  <Transition appear show={open} as={React.Fragment}>
    <Dialog as="div" className="relative z-10" onClose={onClose}>
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
            'w-full max-w-sm inline-block transform rounded-xl bg-white align-middle shadow-lg transition-all',
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
