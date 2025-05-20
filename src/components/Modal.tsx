import { Dialog, Transition } from '@headlessui/react';
import localFont from 'next/font/local';
import type { MutableRefObject, ReactElement, ReactNode } from 'react';
import React from 'react';

import type { WithChildren } from '@/components/private/types';
import { mergeClassnames } from '@/components/private/utils';

import Backdrop from './Backdrop';

const poppins = localFont({
  src: [
    {
      path: '../styles/fonts/SVN-Poppins-ExtraLight.otf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../styles/fonts/SVN-Poppins-ExtraLightItalic.otf',
      weight: '200',
      style: 'italic',
    },
    {
      path: '../styles/fonts/SVN-Poppins-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../styles/fonts/SVN-Poppins-LightItalic.otf',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../styles/fonts/SVN-Poppins-Medium.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../styles/fonts/SVN-Poppins-MediumItalic.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../styles/fonts/SVN-Poppins-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../styles/fonts/SVN-Poppins-BoldItalic.otf',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../styles/fonts/SVN-Poppins-ExtraBold.otf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../styles/fonts/SVN-Poppins-ExtraBoldItalic.otf',
      weight: '800',
      style: 'italic',
    },
    {
      path: '../styles/fonts/SVN-Poppins-Black.otf',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../styles/fonts/SVN-Poppins-BlackItalic.otf',
      weight: '900',
      style: 'italic',
    },
  ],
});

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
}) => (
  <Transition appear show={open} as={React.Fragment}>
    <Dialog
      as="div"
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
  <div className="fixed inset-0 overflow-y-auto bg-black/70">
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
