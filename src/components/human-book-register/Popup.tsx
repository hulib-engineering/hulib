'use client';

import * as React from 'react';

import Modal from '@/components/Modal';

type Props = {
  open: boolean;
  title: string;
  description: string;
  actions: any;
  onClose: () => void;
};
const Popup = (props: Props) => {
  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Modal.Backdrop />
      <Modal.Panel className="w-full p-4 sm:!w-fit lg:p-10">
        <div className="flex !w-fit flex-col items-center justify-center gap-5 rounded-lg bg-white">
          <h4 className="text-center text-2xl font-medium capitalize text-[#000000] lg:text-[28px]">
            {props.title}
          </h4>
          <p className="text-center text-sm font-medium leading-4 text-[#000000CC]">
            {props.description}
          </p>
          <div className="flex items-center gap-3">{props.actions}</div>
        </div>
      </Modal.Panel>
    </Modal>
  );
};

export default Popup;
