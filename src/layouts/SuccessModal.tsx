'use client';

import Image from 'next/image';
import React from 'react';

import Button from '@/components/button/Button';
import Modal from '@/components/Modal';
import { mergeClassnames } from '@/components/private/utils';

export type ISuccessFormModalProps = {
  name: string;
  open: boolean;
  onClose: () => void;
};

const SuccessFormModal = (props: ISuccessFormModalProps) => (
  <Modal open={props.open} onClose={props.onClose}>
    <Modal.Backdrop />
    <Modal.Panel
      className={mergeClassnames('w-5/6 min-w-[345px] 2xl:min-w-[550px]')}
    >
      <div
        className={mergeClassnames(
          'flex w-full flex-col items-center justify-center rounded-[20px]',
          'bg-[#F3F4F6] bg-opacity-100 bg-gradient-to-bl from-white/20 to-[#F9DA6C33] bg-blend-multiple',
        )}
      >
        <div className="flex min-h-[25.5rem] w-2/3 flex-col items-center justify-start py-20">
          <div className="m-auto flex flex-col items-center justify-center gap-12">
            <Image
              alt="Illustration image"
              src="/assets/images/success-illus.svg"
              priority
              width={450}
              height={400}
              className="object-contain"
            />
            <div className="flex flex-col gap-2 text-center">
              <p>
                Chào <span className="font-bold">{props.name}</span>,
              </p>
              <p>Chúng tôi xác nhận bạn đã đăng ký thành công.</p>
              <p>
                Cảm ơn bạn đã đăng ký tham gia chương trình &rsquo;Bong, tiếng
                chuông tỉnh thức!&rsquo; vào ngày 14/12/2024.
              </p>
              <p>
                Chúng tôi rất vui khi được đồng hành cùng bạn trong sự kiện sắp
                tới! Vào trước ngày diễn ra sự kiện BTC sẽ gửi một email nhắc
                nhở bạn về chương trình, mong bạn sẽ để ý check mail nhé!
              </p>
            </div>
            <div className="flex items-center justify-center">
              <Button type="button" onClick={props.onClose}>
                Gotchaaaa
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal.Panel>
  </Modal>
);

export default SuccessFormModal;
