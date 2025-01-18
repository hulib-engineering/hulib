import * as React from 'react';

import HumanBookInfo from '@/components/book-detail/HumanBookInfo';
import Story from '@/components/book-detail/Story';

export default function Index() {
  return (
    <div className="mx-auto w-full px-28">
      <div className="rounded-[20px] bg-white">
        <div className="p-5">
          <div className="flex justify-start gap-5">
            <div className="flex-1">
              <Story
                cover={{
                  id: '1',
                  path: '/assets/images/user-avatar.jpeg',
                }}
                title="Story of my life"
                abstract='Embark on a journey through the vivid tapestry of my life story, where each chapter unfolds with a unique blend of triumphs, obstacles conquered, and meaningful relationships that have shaped the very essence of my being. Step into the limelight of my experiences as they shine brightly in "Chronicles of My Life", illuminating the moments of triumph, challenges overcome, and the profound connections woven into the fabric of my existence. Embark on a journey through the vivid tapestry of my life story, where each chapter unfolds with a unique blend of triumphs, obstacles conquered, and meaningful relationships that have shaped the very essence of my being. Step into the limelight of my experiences as they shine brightly in "Chronicles of My Life", illuminating the moments of triumph, challenges overcome, and the profound connections woven into the fabric of my existence. Embark on a journey through the vivid tapestry of my life story, where each chapter unfolds with a unique blend of triumphs, obstacles conquered, and meaningful relationships that have shaped the very essence of my being. Step into the limelight of my experiences as they shine brightly in "Chronicles of My Life", illuminating the moments of triumph, challenges overcome, and the profound connections woven into the fabric of my existence. Embark on a journey through the vivid tapestry of my life story, where each chapter unfolds with a unique blend of triumphs, obstacles conquered, and meaningful relationships that have shaped the very essence of my being. Step into the limelight of my experiences as they shine brightly in "Chronicles of My Life", illuminating the moments of triumph, challenges overcome, and the profound connections woven into the fabric of my existence.'
              />
            </div>
            <div className="w-[268px] bg-primary-10">
              <HumanBookInfo />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
