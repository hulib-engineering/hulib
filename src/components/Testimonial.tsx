/* eslint-disable import/no-extraneous-dependencies */

'use client';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { Poppins } from 'next/font/google';
import React from 'react';

import TestimonialCard from './TestimonialCard';
// import Slider from 'react-slick';

const testimonialCards = [
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
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
});
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
    <div
      className={`${poppins.className} flex flex-col items-center justify-center`}
    >
      <div className="flex flex-col items-center justify-center gap-3 self-center">
        <p className="!my-0 self-stretch text-center text-lg font-semibold uppercase leading-[1.6785rem]">
          Meet our team
        </p>
        <h1 className="text-center text-[3.5rem] font-medium leading-[4.2rem]">
          Lorem ipsum dolor sit amet
        </h1>
      </div>
      <div className="w-screen">
        {testimonialCards.map((t) => (
          <TestimonialCard
            key={Math.floor(Math.random() * 1000 * testimonialCards.length)}
            content={t.content}
            imageUrl={t.imageUrl}
            name={t.name}
            position={t.position}
          />
        ))}
      </div>
    </div>
  );
};

export default Testimonial;
