import { useTranslations } from 'next-intl';
import React from 'react';

import InfoContainer from '@/components/InfoContainer';

const InfoList = [
  {
    key: 'about_stories' as const,
    image: {
      src: '/assets/images/visual.png',
      position: 'left' as const,
    },
  },
  {
    key: 'about_mission' as const,
    image: {
      src: '/assets/images/visual-1.png',
      position: 'right' as const,
    },
  },
  {
    key: 'about_vision' as const,
    image: {
      src: '/assets/images/visual-2.png',
      position: 'left' as const,
    },
  },
];

const About = () => {
  const t = useTranslations('Index');

  return (
    <section className="mt-8 px-4 py-3 sm:px-32 lg:py-[6.25rem] 2xl:px-60">
      <div className="mb-6 text-center sm:px-20 lg:mb-[5.625rem]">
        <div className="text-xs font-semibold uppercase text-primary sm:text-lg">
          {t('about_title')}
        </div>
        <div className="text-[28px] font-semibold capitalize text-slate-1000 sm:text-[56px]">
          {t('about_description')}
        </div>
      </div>
      <div className="flex flex-col gap-6 lg:gap-[6.25rem]">
        {InfoList.map((info, index) => (
          <InfoContainer
            key={index}
            i18nKey={info.key}
            isTitleOutstanding={
              info.key === 'about_mission' || info.key === 'about_vision'
            }
            titleHighlightTextColor={
              info.key === 'about_stories' ? 'primary' : 'secondary'
            }
            imageSrc={info.image.src}
            imageAlt={`Visual ${index}`}
            imagePos={info.image.position}
          />
        ))}
      </div>
      {/* <div className="grid grid-cols-3 gap-6 p-8"> */}
      {/*  {FeatureList.map((feature) => ( */}
      {/*    <FeatureCard */}
      {/*      key={feature.key} */}
      {/*      title={t(`${feature.key}.title`)} */}
      {/*      description={t(`${feature.key}.description`)} */}
      {/*      bgColor={feature.bgColor} */}
      {/*      shadowColor={feature.shadowColor} */}
      {/*    /> */}
      {/*  ))} */}
      {/* </div> */}
    </section>
  );
};

export default About;
