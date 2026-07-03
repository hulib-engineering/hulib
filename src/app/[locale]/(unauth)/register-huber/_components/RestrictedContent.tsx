'use client';
import Image from 'next/image';

const avoidItems = [
  'Cổ súy hành vi gây hại bản thân hoặc người khác.',
  'Tiết lộ thông tin riêng tư của người khác khi chưa được sự đồng ý.',
  'Lan truyền thông tin sai lệch hoặc chưa được kiểm chứng.',
  'Công kích cá nhân hoặc kích động thù ghét.',
  'Mô tả quá chi tiết các nội dung nhạy cảm.',
  'Đề cập đến các chủ đề chính trị, tôn giáo hoặc các vấn đề dễ gây tranh cãi theo hướng đối đầu.',
];

export default function RestrictedContent() {
  return (
    <div className="mb-[20px] w-full rounded-2xl border border-[#FFE3CC] bg-[#FFF9F5] px-9 py-7">
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex items-center justify-center rounded-full bg-[#FFE3CC] p-[8px]">
          <Image
            src="/assets/images/register-huber/warning.png"
            alt="warning"
            width={30}
            height={30}
          />
        </div>
        <h3 className="text-[16px] font-[500] leading-[24px] tracking-[0.5%] text-black">Nội dung cần tránh</h3>
      </div>

      {/* Grid 2 columns */}
      <div className="grid grid-cols-2 gap-x-12 gap-y-3">
        {avoidItems.map((item, idx) => {
          return (
            <div key={idx} className="flex items-start gap-2.5">
              <img
                src="/assets/images/register-huber/x_circle.png"
                alt="x"
                className="mt-0.5 size-5 flex-shrink-0"
              />
              <span className="text-[14px] leading-[22px] text-[#171819]">{item}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
