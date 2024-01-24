import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { useTranslations } from 'next-intl';
import React from 'react';

import TestimonialItemCard from '@/components/TestimonialItemCard';

// import TestimonialCard from './TestimonialCard';
// import Slider from 'react-slick';

const TestimonialItems = [
  {
    content:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. A esse dicta, consequuntur deleniti nam cumque pariatur rerum qui iste. Blanditiis, atque libero natus qui consectetur reiciendis. Sapiente, illo incidunt. Deserunt?',
    name: 'Name Surname',
    imageUrl: '',
    position: 'Position',
  },
  {
    content:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. A esse dicta, consequuntur deleniti nam cumque pariatur rerum qui iste. Blanditiis, atque libero natus qui consectetur reiciendis. Sapiente, illo incidunt. Deserunt?',
    name: 'Name Surname',
    imageUrl: '',
    position: 'Position',
  },
  {
    content:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. A esse dicta, consequuntur deleniti nam cumque pariatur rerum qui iste. Blanditiis, atque libero natus qui consectetur reiciendis. Sapiente, illo incidunt. Deserunt?',
    name: 'Name Surname',
    imageUrl: '',
    position: 'Position',
  },
  {
    content:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. A esse dicta, consequuntur deleniti nam cumque pariatur rerum qui iste. Blanditiis, atque libero natus qui consectetur reiciendis. Sapiente, illo incidunt. Deserunt?',
    name: 'Name Surname',
    imageUrl: '',
    position: 'Position',
  },
  {
    content:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. A esse dicta, consequuntur deleniti nam cumque pariatur rerum qui iste. Blanditiis, atque libero natus qui consectetur reiciendis. Sapiente, illo incidunt. Deserunt?',
    name: 'Name Surname',
    imageUrl: '',
    position: 'Position',
  },
  {
    content:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. A esse dicta, consequuntur deleniti nam cumque pariatur rerum qui iste. Blanditiis, atque libero natus qui consectetur reiciendis. Sapiente, illo incidunt. Deserunt?',
    name: 'Name Surname',
    imageUrl: '',
    position: 'Position',
  },
  {
    content:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. A esse dicta, consequuntur deleniti nam cumque pariatur rerum qui iste. Blanditiis, atque libero natus qui consectetur reiciendis. Sapiente, illo incidunt. Deserunt?',
    name: 'Name Surname',
    imageUrl: '',
    position: 'Position',
  },
  {
    content:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. A esse dicta, consequuntur deleniti nam cumque pariatur rerum qui iste. Blanditiis, atque libero natus qui consectetur reiciendis. Sapiente, illo incidunt. Deserunt?',
    name: 'Name Surname',
    imageUrl: '',
    position: 'Position',
  },
];
// const poppins = Poppins({
//   subsets: ['latin'],
//   weight: ['300', '400', '500', '600', '700', '800'],
// });
// interface ArrowProps {
//   className?: string;
//   style?: React.CSSProperties;
//   onClick?: () => void;
// }

// function SampleNextArrow(props: ArrowProps) {
//   const { className, style, onClick } = props;
//   return (
//     <button
//       type="button"
//       className={className}
//       style={{ ...style, display: 'block', background: 'red' }}
//       onClick={onClick}
//       onKeyDown={onClick}
//     >
//       Next
//     </button>
//   );
// }

// function SamplePrevArrow(props: ArrowProps) {
//   const { className, style, onClick } = props;
//   return (
//     <button
//       type="button"
//       className={className}
//       style={{ ...style, display: 'block', background: 'red' }}
//       onClick={onClick}
//       onKeyDown={onClick}
//     >
//       Prev
//     </button>
//   );
// }

const Testimonial = () => {
  const t = useTranslations('Index');

  // const settings = {
  //   className: 'center',
  //   infinite: true,
  //   centerPadding: '60px',
  //   slidesToShow: 5,
  //   swipeToSlide: true,
  //   nextArrow: <SampleNextArrow />,
  //   prevArrow: <SamplePrevArrow />,
  // };
  return (
    // <div>
    //   <h2>Swipe To Slide</h2>
    //   <Slider {...settings}>
    //     {testimonialCards.map((testimonial) => (
    //       <div
    //         key={Math.floor(Math.random() * testimonialCards.length)}
    //         className="h-40 w-20 bg-slate-200"
    //       >
    //         {/* <p>{testimonial.content}</p> */}
    //         <p>{testimonial.name}</p>
    //         <p>{testimonial.position}</p>
    //       </div>
    //     ))}
    //   </Slider>
    // </div>
    <>
      <div className="text-center">
        <p className="text-lg font-semibold uppercase">
          {t('testimonial_title')}
        </p>
        <h1 className="text-[3.5rem] font-medium">
          {t('testimonial_description')}
        </h1>
      </div>
      <div className="w-screen">
        {TestimonialItems.map((each, index) => (
          <TestimonialItemCard
            key={index}
            content={each.content}
            avatarUrl={each.imageUrl}
            name={each.name}
            role={each.position}
          />
        ))}
      </div>
    </>
  );
};

export default Testimonial;
