'use client';
import Image from 'next/image';

export default function Herobanner() {
  return (
    <div className="relative mb-8 flex min-h-[140px] items-center overflow-hidden rounded-2xl bg-[#EEF2FF] px-8 pt-6">
      {/* Mascot */}
      <div className="relative z-10 mr-8 aspect-[195/130] w-[300px] shrink-0">
        <Image
          src="/assets/images/register-huber/huber.png"
          alt="Mascot"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Text */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-8">
        <div className="mb-[10px] flex items-center justify-center">
          <h2 className="m-0 mr-[8px] text-center text-[20px] font-[500] leading-[28px] text-black">
            Hướng Dẫn Tạo Sách
          </h2>
          <Image src="/assets/images/register-huber/mini_book.png" alt="mini-book" width={20} height={20} />
        </div>
        <p className="w-[460px] text-center text-[16px] leading-[20px] text-[#45484A]">
          HuLib rất mong chờ được đọc và lan tỏa câu chuyện của bạn đến cộng đồng. Trước khi bắt đầu tạo sách, tụi mình có một vài lưu ý nhỏ để cùng xây dựng một không gian chia sẻ tích cực, an toàn và ý nghĩa nhé.
        </p>
      </div>
    </div>
  );
}
