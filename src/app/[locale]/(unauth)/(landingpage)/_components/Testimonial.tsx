'use client';

import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import Modal from '@/components/Modal';
import TestimonialItemCard from '@/components/TestimonialItemCard';

const TestimonialItems = [
  {
    content:
      'Thực hiện một dự án với mục đích nâng cao "giá trị hạnh phúc" của các bạn trẻ luôn là ước mơ mà mình đã ấp ủ bấy lâu nay. Cơ duyên đưa mình đến HuLib, là nơi chữa lành mình và cũng là nơi giúp mọi người chữa lành. Biết ơn vì đã trở thành một cánh hoa của bông hoa xinh đẹp HuLib <3.',
    name: 'Hoàng Phương Thảo',
    avatarUrl: '/assets/images/avatars/po_member_1.jpg',
    position: 'Team PO',
  },
  {
    content:
      'Mình ấn tưởng bởi bạn quản lý dự án này, bạn cho mình thấy được sự tận tâm và tâm huyết của bạn dành cho dự án và cộng đồng. Hi vọng dự án sẽ thành công và giúp đỡ được các bạn trẻ tại miền Trung.',
    name: 'Nguyễn Ngọc Minh',
    avatarUrl: '/assets/images/avatars/ha_member_1.png',
    position: 'Team HA',
  },
  {
    content:
      'Theo mình HuLib là một dự án với mission mới toanh ở miền Trung nói riêng và Việt Nam nói chung. Kết nối những người có kinh nghiệm \'thực chiến\' dày dặn trong lĩnh vực của họ với các bạn mentees chắc chắn sẽ là tạo ra ảnh hưởng lớn đến với các bạn trong tương lai. Mình mong dự án sẽ bay cao bay xa trong trong thời gian tới. Chúc toàn bộ team luôn giữ được nhiệt huyết ạ~',
    name: 'Quỳnh Lê',
    avatarUrl: '/assets/images/avatars/pf_member_2.jpeg',
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
      'Mình rất vui và tự hào vì được tham gia vào HuLib để tạo nên cộng đồng và giúp đỡ các bạn trẻ. Thông qua dự án mình cũng đã làm quen được nhiều người tài giỏi, giúp mình phát triển kinh nghiệm và trải nghiệm trong nhiều lĩnh vực.',
    name: 'Đặng Hùng Vĩnh',
    avatarUrl: '/assets/images/avatars/td_member_2.png',
    position: 'Team TD',
  },
  {
    content:
      'Tham gia dự HuLib từ những buổi đầu đến bây giờ đã được hơn 3 tháng rồi. Đây có lẽ là điều mình tự hào nhất, vui nhất nhưng cũng vô cùng thách thức với mình. Mình vui vì được học hỏi thật nhiều điều từ các anh chị vô cùng giỏi, và cũng thật khó khăn vì mình còn thật nhiều chưa biết, chưa làm được. Nhưng mình sẽ cố gắng hơn và trải nghiệm thật nhiều thứ hơn ở dự án ý nghĩa này. 🌷',
    name: 'Lê Thị Quỳnh Nga ',
    avatarUrl: '/assets/images/avatars/po_member_2.jpg',
    position: 'Team PO',
  },
  {
    content:
      'Just quick note to say being part of HuLib has been more than I expected. Before joining, I genuinely loved the vision and mission of this project. As an HR member, it opened my eyes to a world of learning and growth. Working with my team has been a joy – they\'re not just friendly; they\'re talented and supportive. And you know what\'s cool? HuLib is more than a project; it\'s my journey to well-being. I\'ve tackled insecurities, made many lovely friends, and learned tons. I hope our HuLib will be truly successful.',
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
      'HuLib là một dự án thật sự ý nghĩa. HuLib chúng tôi phần nào có thể đóng góp theo cách nào đó để hỗ trợ hạnh phúc của giới trẻ. Tôi tin rằng mỗi chúng ta đều có những câu chuyện cần được chia sẻ. Tôi rất vui khi được đồng hành cùng những đồng nghiệp, bạn bè giàu kinh nghiệm trong việc phát triển HuLib để hoàn thành sứ mệnh của mình.',
    name: 'Nguyễn Đỗ Phương Uyên',
    avatarUrl: '/assets/images/avatars/mc_member_2.jpg',
    position: 'Team MC',
  },
  {
    content:
      'Rất là vui khi lần đầu được tham gia vào một dự án cộng đồng như vậy. Thông qua dự án mình cũng đã được áp dụng những kiến thức được học mà 3 năm làm việc vừa qua không có cơ hội biến những kiến thức đó thành hiện thực. Cũng rất vui vì vừa được tự do sáng tạo vừa có thể tạo ra một giá trị ý nghĩa cho cộng đồng <3',
    name: 'Phan Thanh Bảo Châu',
    avatarUrl: '/assets/images/avatars/td_member_1.jpg',
    position: 'Team TD',
  },

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
    <section className="mt-8 flex flex-col items-center justify-center px-4 py-3 text-slate-1000 sm:px-0 sm:py-[100px] lg:mt-0">
      <div className="mx-auto mb-8 text-center sm:w-3/4 lg:px-10 2xl:px-[5.625rem]">
        <p className="mb-3 text-xs font-semibold uppercase text-lp-primary-blue sm:text-lg">
          {t('testimonial_title')}
        </p>
        <h1 className="text-[1.75rem] font-bold sm:text-[3.5rem]">
          {t('testimonial_description')}
        </h1>
      </div>
      <div className="my-6 w-screen px-6 sm:my-0 sm:px-0">
        <Swiper
          spaceBetween={8}
          slidesPerView={1}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 16,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
            1536: {
              slidesPerView: 4,
              spaceBetween: 32,
            },
          }}
          loop
          centeredSlides
          // navigation
          modules={[Pagination]}
        >
          {TestimonialItems.map((each, index) => (
            <SwiperSlide key={each.name}>
              <TestimonialItemCard
                content={each.content}
                avatarUrl={each.avatarUrl}
                name={each.name}
                role={each.position}
                onClick={() => handleOpenCardDetailModal(index)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <Modal open={isCardDetailOpen} onClose={() => setIsCardDetailOpen(false)}>
        <Modal.Backdrop />
        <Modal.Panel className="w-[53.875rem]">
          {TestimonialItems[currentCardIndex] && (
            <TestimonialItemCard
              isPopup
              onClose={() => setIsCardDetailOpen(false)}
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
