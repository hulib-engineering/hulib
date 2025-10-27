import Image from 'next/image';
import React from 'react';

import { mergeClassnames } from '@/components/core/private/utils';

export default function OurMascot() {
  // const t = useTranslations('Index');

  return (
    <section className="relative mx-auto flex w-full flex-col items-center justify-center gap-[90px] px-4 text-slate-1000 sm:py-[100px] lg:max-w-7xl lg:px-0">
      <div className="flex w-full flex-col gap-3 text-center">
        <p className="text-xs font-semibold uppercase text-lp-primary-blue sm:text-lg">
          nhân vật đại diện
        </p>
        <h1 className="text-[1.75rem] font-medium sm:text-[3.5rem]">
          Từ sẻ chia đến thấu hiểu
        </h1>
      </div>
      <div className="flex w-full items-center justify-center">
        <div className="relative h-[478px] w-[470px]">
          <Image
            src="/assets/images/our-mascots.png"
            alt="Our Mascot Illustration"
            width={462}
            height={462}
            className="absolute left-2 top-1 aspect-square h-auto w-[462px] object-cover"
          />
          <div className="absolute start-full top-1/2 flex w-[301px] flex-col items-center justify-center gap-2 rounded-[20px] border-4 border-white bg-[#FFF7E3] p-4 shadow-[0_12px_24px_0_#E8F99E] backdrop-blur-[50px] -translate-y-1/2">
            <h2 className="text-4xl font-bold uppercase leading-[44px] text-[#BF9534]">liber</h2>
            <p
              className={mergeClassnames(
                'text-center text-base font-medium text-[#002254] text-opacity-80',
              )}
            >
              Xin chào, mình là
              {' '}
              <b>Liber</b>
              . Mình đang gặp những vấn đề trong cuộc sống, có những điều chưa thể vượt qua, và mình cần nhận được sự giúp đỡ, lắng nghe
            </p>
          </div>
          <div className="absolute end-full top-1/2 flex w-[301px] flex-col items-center justify-center gap-2 rounded-[20px] border-4 border-white bg-[#D9E6FD] p-4 shadow-[0_12px_24px_0_#9EC2F9] backdrop-blur-[50px] -translate-x-4 -translate-y-1/2">
            <h2 className="text-4xl font-bold uppercase leading-[44px] text-lp-primary-blue">huber</h2>
            <p className="text-center text-base font-medium text-[#002254] text-opacity-80">
              Xin chào, mình là
              {' '}
              <b>Huber</b>
              {' '}
              - một người từng đi qua những ngày không dễ dàng. Tôi kể câu chuyện của mình không phải để tìm sự thương hại, mà để ai đó cảm thấy họ không đơn độc. Mỗi lần chia sẻ, tôi thấy mình nhẹ hơn, và hy vọng câu chuyện ấy có thể chạm đến một ai đó, giúp họ một phần nào đó trong cuộc sống, dù chỉ một chút.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
