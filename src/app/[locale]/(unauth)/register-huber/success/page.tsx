'use client';

import Image from 'next/image';
import BackButton from '../_components/BackButton';

export default function RegisterHuberSuccess() {
  return (
    <div className="min-h-screen bg-white">
      <BackButton text="Tạo sách" />

      <div className="flex flex-col items-center px-[96px] pb-16 pt-10">
        {/* Book icon */}
        <div className="mb-6">
          <Image
            src="/assets/images/register-huber/blue_book.png"
            alt="Book icon"
            width={100}
            height={100}
            className="object-contain"
          />
        </div>

        {/* Success title */}
        <h1 className="mb-3 text-center text-[28px] font-[500] leading-[36px] text-[#0442BF]">
          Viết câu chuyện thành công
        </h1>

        {/* Subtitle */}
        <p className="mb-10 max-w-md text-center text-[16px] font-[400] leading-[24px] tracking-[0.5%] text-gray-500">
          Thanks for your story! HuLib will keep you informed when our process completes.
        </p>

        {/* Story Card */}
        <div className="mb-10 flex min-h-[300px] w-full max-w-[420px] gap-5 rounded-[16px] border border-[#DDC9EF] bg-[#FAF7FC] p-5">
          <div className="flex flex-1 flex-col gap-3">
            {/* Status badge */}
            <span className="self-start rounded-full bg-[#7C5CBF] px-4 py-1.5 text-xs font-semibold text-white">
              In review
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4">
          <button className="hover:bg-gray-50 h-[44px] w-[232px] rounded-full border border-[#C2C6CF] px-6 py-3 text-sm font-medium text-[#0442BF] transition-colors">
            Quay về trang cá nhân
          </button>
          <button className="flex h-[44px] w-[232px] items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#007CBE] to-[#8845C6] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#14144a]">
            <Image
              src="/assets/images/register-huber/white_book.png"
              alt=""
              width={18}
              height={18}
              className="object-contain brightness-[10]"
            />
            Tạo sách mới
          </button>
        </div>
      </div>
    </div>
  );
}
