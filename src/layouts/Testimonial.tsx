'use client';

import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import Modal from '@/components/Modal';
import TestimonialItemCard from '@/components/TestimonialItemCard';

const TestimonialItems = [
  {
    content:
      'Mình mong muốn đóng góp một cái nhìn mới mẻ hơn về khái niệm well-being tại Việt Nam dành cho các bạn trẻ. Và HuLib đã thực hiện được điều đó, tự hào lắm *bắn tym*',
    name: 'Nguyễn Tiến Đạt',
    avatarUrl: '/assets/images/avatars/td_member_3.JPG',
    position: 'Team TD',
  },
  {
    content:
      'Thực hiện một dự án với mục đích nâng cao "giá trị hạnh phúc" của các bạn trẻ luôn là ước mơ mà mình đã ấp ủ bấy lâu nay. Cơ duyên đưa mình đến HuLib, là nơi chữa lành mình và cũng là nơi giúp mọi người chữa lành. Biết ơn vì đã trở thành một cánh hoa của bông hoa xinh đẹp HuLib <3.',
    name: 'Hoàng Phương Thảo',
    avatarUrl: '/assets/images/avatars/po_member_1.jpg',
    position: 'Team PO',
  },
  {
    content:
      'Mình ấn tưởng bởi bạn project manager cửa dự án này, bạn cho mình thấy được sự tận tâm và tâm huyết của bạn dành cho dự án và cộng đồng. Hi vọng dự án sẽ thành công và giúp đỡ được các bạn trẻ tại miền Trung.',
    name: 'Nguyễn Ngọc Minh',
    avatarUrl: '/assets/images/avatars/ha_member_1.png',
    position: 'Team HA',
  },
  {
    content:
      "Theo mình Hulib là một dự án với mission mới toanh ở miền Trung nói riêng và Việt Nam nói chung. Kết nối những người có kinh nghiệm 'thực chiến' dày dặn trong lĩnh vực của họ với các bạn mentees chắc chắn sẽ là tạo ra ảnh hưởng lớn đến với các bạn trong tương lai. Mình mong dự án sẽ bay cao bay xa trong trong thời gian tới. Chúc toàn bộ team luôn giữ được nhiệt huyết ạ~",
    name: 'Lê Thị Như Quỳnh',
    avatarUrl: '/assets/images/avatars/pf_member_2.JPG',
    position: 'Team PF',
  },
  {
    content:
      'Dù HuLib chỉ mới chạy được vài tháng nhưng mình cảm nhận được sự chuyên nghiệp và sự cam kết mạnh mẽ đến từ tất cả các thành viên. Đặc biệt nhất phải nói đến việc nhiều thành viên của HuLib hiện đang sinh sống và học tập ở nhiều nước khác nhau, cũng như có nhiều background khác nhau tạo nên 1 môi trường đa dạng. Nhờ đó mà mình học hỏi được khá nhiều điều hay và thú vị!!',
    name: 'Berly Nguyễn',
    avatarUrl: '/assets/images/avatars/mc_member_1.jpg',
    position: 'Team MC',
  },
  {
    content:
      'Mình mong muốn đóng góp một cái nhìn mới mẻ hơn về khái niệm well-being tại Việt Nam dành cho các bạn trẻ. Và HuLib đã thực hiện được điều đó, tự hào lắm *bắn tym*',
    name: 'Đặng Hùng Vĩnh',
    avatarUrl: '/assets/images/avatars/td_member_2.png',
    position: 'Team TD',
  },
  {
    content:
      'Tham gia dự Hulib từ những buổi đầu đến bây giờ đã được hơn 3 tháng rồi. Đây có lẽ là điều mình tự hào nhất, vui nhất nhưng cũng vô cùng thách thức với mình. Mình vui vì được học hỏi thật nhiều điều từ các anh chị vô cùng giỏi, và cũng thật khó khăn vì mình còn thật nhiều chưa biết, chưa làm được. Nhưng mình sẽ cố gắng hơn và trải nghiệm thật nhiều thứ hơn ở dự án ý nghĩa này. 🌷',
    name: 'Lê Thị Quỳnh Nga ',
    avatarUrl: '/assets/images/avatars/po_member_2.jpg',
    position: 'Team PO',
  },
  // {
  //   content:
  //     'Việc trở thành một phần của HuLib đã mang lại nhiều điều hơn tôi mong đợi. Trước khi tham gia, tôi thực sự yêu thích tầm nhìn và sứ mệnh của dự án này. Sau đó, với tư cách là một thành viên nhân sự, nó đã mở ra cho tôi một thế giới học hỏi và phát triển. Làm việc với nhóm của tôi là một niềm vui – họ không chỉ thân thiện mà còn tài năng và luôn hỗ trợ nhau. Và bạn biết điều gì thú vị không? HuLib không chỉ là một dự án, đó là hành trình hướng tới hạnh phúc của tôi. Tôi đã giải quyết được những khó khăn, có được nhiều người bạn đáng yêu và học được rất nhiều điều. Tôi hy vọng HuLib của chúng tôi sẽ thực sự thành công!',
  //   name: 'Rumy (Phương Đoàn)',
  //   avatarUrl: '',
  //   position: 'Team HA',
  // },
  {
    content:
      "Just quick note to say being part of HuLib has been more than I expected. Before joining, I genuinely loved the vision and mission of this project. As an HR member, it opened my eyes to a world of learning and growth. Working with my team has been a joy – they're not just friendly; they're talented and supportive. And you know what's cool? HuLib is more than a project; it's my journey to well-being. I've tackled insecurities, made many lovely friends, and learned tons. I hope our HuLib will be truly successful.",
    name: 'Doan Duy My Phuong',
    avatarUrl: '/assets/images/avatars/ha_member_3.jpeg',
    position: 'Team HA',
  },
  {
    content:
      'Mình mong muốn đóng góp một cái nhìn mới mẻ hơn về khái niệm well-being tại Việt Nam dành cho các bạn trẻ. Và HuLib đã thực hiện được điều đó, tự hào lắm *bắn tym*',
    name: 'Trâm Phạm',
    avatarUrl: '/assets/images/avatars/pf_member_1.png',
    position: 'Team PF',
  },
  {
    content:
      'Hulib là một dự án thật sự ý nghĩa. HuLib chúng tôi phần nào có thể đóng góp theo cách nào đó để hỗ trợ hạnh phúc của giới trẻ. Tôi tin rằng mỗi chúng ta đều có những câu chuyện cần được chia sẻ. Tôi rất vui khi được đồng hành cùng những đồng nghiệp, bạn bè giàu kinh nghiệm trong việc phát triển Hulib để hoàn thành sứ mệnh của mình.',
    name: 'Nguyễn Đỗ Phương Uyên',
    avatarUrl: '/assets/images/avatars/mc_member_2.jpg',
    position: 'Team MC',
  },
  {
    content:
      'Mình mong muốn đóng góp một cái nhìn mới mẻ hơn về khái niệm well-being tại Việt Nam dành cho các bạn trẻ. Và HuLib đã thực hiện được điều đó, tự hào lắm *bắn tym*',
    name: 'Phan Thanh Bảo Châu',
    avatarUrl: '/assets/images/avatars/td_member_1.jpg',
    position: 'Team TD',
  },
  // {
  //   content:
  //     'Hulib là một dự án cộng đồng vô cùng ý nghĩa khi tạo ra một cộng đồng trực tuyến thân thiên và chu đáo. Tôi đã làm việc với team HR của team HuLib một thời gian và đã gặp gỡ những người đồng đội tuyệt vời. Chúng tôi đã cùng cố gắng động viên nhau vượt qua nhiều nhiệm vụ khó khăn. ',
  //   name: 'Thai Hoai Thuong',
  //   avatarUrl: '',
  //   position: 'Team HA',
  // },
  {
    content:
      'HuLib is a meaningful project, it has created a genuinely welcoming, thoughtful and caring community online. I find it amazing when meeting everyone, and so admire how they are motivating others.',
    name: 'Thai Hoai Thuong',
    avatarUrl: '/assets/images/avatars/ha_member_2.jpg',
    position: 'Team HA',
  },
];

const Testimonial = () => {
  const t = useTranslations('Index');

  const [isCardDetailOpen, setIsCardDetailOpen] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const handleOpenCardDetailModal = (index: number) => {
    setCurrentCardIndex(index);
    setIsCardDetailOpen(true);
  };

  return (
    <section className="flex flex-col items-center justify-center py-[6.25rem] text-slate-1000">
      <div className="mb-8 px-[20.625rem] text-center">
        <p className="text-lg font-semibold uppercase text-primary">
          {t('testimonial_title')}
        </p>
        <h1 className="text-[3.5rem] font-medium">
          {t('testimonial_description')}
        </h1>
      </div>
      <div className="w-screen">
        <Swiper
          spaceBetween={32}
          slidesPerView={4}
          loop
          centeredSlides
          navigation
          modules={[Pagination, Navigation]}
          slideToClickedSlide
        >
          {TestimonialItems.map((each, index) => (
            <SwiperSlide
              key={index}
              onClick={() => handleOpenCardDetailModal(index)}
            >
              <TestimonialItemCard
                content={each.content}
                avatarUrl={each.avatarUrl}
                name={each.name}
                role={each.position}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <Modal open={isCardDetailOpen} onClose={() => setIsCardDetailOpen(false)}>
        <Modal.Backdrop />
        <Modal.Panel>
          {TestimonialItems[currentCardIndex] && (
            <TestimonialItemCard
              className="scale-150"
              avatarUrl={TestimonialItems[currentCardIndex]?.avatarUrl || ''}
              content={TestimonialItems[currentCardIndex]?.content || ''}
              name={TestimonialItems[currentCardIndex]?.name || ''}
              role={TestimonialItems[currentCardIndex]?.position || ''}
            />
          )}
        </Modal.Panel>
      </Modal>
    </section>
  );
};

export default Testimonial;
