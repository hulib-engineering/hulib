'use client';

import React, { useState } from 'react';

import { ArrowDown } from '@phosphor-icons/react';
import IconButton from '@/components/core/iconButton/IconButton';
import Modal from '@/components/Modal';
import { CustomCover } from '@/components/stories/CustomCover';
import { DetailedStoryWithCover } from '@/components/stories/DetailedStoryWithCover';

export default function TrySampleStory() {
  // const t = useTranslations('Index');

  const [isDetailStoryShown, setIsDetailStoryShown] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <span className="text-lg uppercase text-lp-primary-blue">
          try me
        </span>
        <IconButton
          size="lg"
          variant="secondary"
          className="animate-bounce-to-highlight bg-white text-lp-primary-blue hover:bg-[#D9E6FD]"
        >
          <ArrowDown />
        </IconButton>
      </div>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <div onClick={() => setIsDetailStoryShown(true)}>
        <CustomCover titleStory="Cơn ác mộng đã lâu không trở lại" authorName="Bùi Tôn Mỹ Hảo" />
      </div>
      <Modal open={isDetailStoryShown} onClose={() => setIsDetailStoryShown(false)}>
        <Modal.Backdrop />
        <Modal.Panel className="bg-transparent xl:max-w-5xl">
          <DetailedStoryWithCover
            title="Cơn ác mộng đã lâu không trở lại"
            authorName="Bùi Tôn Mỹ Hảo"
            abstract="Người ta thường nói, nếu có một tấm vé trở về tuổi thơ, họ sẽ mua bằng mọi giá. Riêng tôi thì không. Chẳng có khoảnh khắc nào trong quãng thiếu thời khiến tôi muốn quay lại.

       Đôi khi, trong những giấc mơ đêm, ký ức lại khẽ mở ra: một mái nhà vắng bóng hạnh phúc, những lời nói và hành động giữa cha mẹ gieo vào tôi nỗi sợ hãi, ám ảnh. Dù năm tháng đã lùi xa, tôi vẫn thấy mình chỉ muốn trốn chạy. Những điều lẽ ra một đứa trẻ không nên chứng kiến, tôi lại nhìn gần như tất cả.

       Không ít lần, câu hỏi xoáy mãi trong đầu tôi: “Có phải mình là một sai lầm, một gánh nặng?” Tự trách, nghi hoặc, giằng xé—tất cả bám riết suốt một thời gian dài. Người ta không ai được quyền chọn tuổi thơ cho mình. Và tôi, dù mang đầy vết xước, vẫn học cách chấp nhận, vẫn cố giữ lấy những mảnh vụn dịu dàng còn sót lại từ những tổn thương tưởng chừng nhỏ bé."
          />
        </Modal.Panel>
      </Modal>
    </>
  );
};
