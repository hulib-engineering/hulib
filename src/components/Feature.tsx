import React from 'react';

import FeatureCard from '@/common/FeatureCard';

const featureList = [
  {
    content:
      '200+ mentors and volunteers having personal experience with the same problem you’re into.',
    image: '',
    heading: 'People with the same stuffs',
    bgColor: 'rgba(187,249,158,0.75)',
  },
  {
    content:
      'Book a meeting with any mentor you want to share and let them you about your struggles.',
    image: '',
    heading: 'Online Meeting',
    bgColor: 'rgba(204, 186, 254, 0.75)',
  },
  {
    content: 'Feel free to share your stories without being judged.',
    image: '',
    heading: 'Safely Sharing',
    bgColor: 'rgba(255, 224, 142, 0.75)',
  },
];
const Feature = () => {
  return (
    <section className="flex flex-col items-center gap-20 self-stretch px-80 py-[6.25rem]">
      <div className="flex items-center justify-center gap-6 self-stretch p-8">
        {featureList.map((feat) => (
          <FeatureCard
            content={feat.content}
            heading={feat.heading}
            imageUrl={feat.image}
            bgColor={feat.bgColor}
            key={Math.random() * 1000 * featureList.length}
          />
        ))}
      </div>
    </section>
  );
};

export default Feature;
