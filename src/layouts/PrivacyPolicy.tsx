import { XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
// import { useTranslations } from 'next-intl';
import React from 'react';

// const InfoList = [
//   {
//     key: 'about_stories' as const,
//     image: {
//       src: '/assets/images/visual.png',
//       position: 'left' as const,
//     },
//   },
//   {
//     key: 'about_mission' as const,
//     image: {
//       src: '/assets/images/visual-1.png',
//       position: 'right' as const,
//     },
//   },
//   {
//     key: 'about_vision' as const,
//     image: {
//       src: '/assets/images/visual-2.png',
//       position: 'left' as const,
//     },
//   },
// ];

const PrivacyPolicy = ({ onClose }: { onClose: () => void }) => {
  // const t = useTranslations('Index');

  return (
    <div className="flex w-full flex-col items-center justify-center gap-12 rounded-3xl bg-white p-12">
      <div className="inline-flex w-full items-center justify-between">
        <Image
          alt="HULIB minified logo"
          src="/assets/images/minified-HULIB-logo.png"
          width={36}
          height={42}
          className="object-contain"
          loading="eager"
        />
        <h1 className="text-[28px] font-semibold text-slate-1000">
          Privacy Policy
        </h1>
        <button type="button" onClick={onClose}>
          <XMarkIcon width={24} height={24} />
        </button>
      </div>
      <div className="mb-8 h-[25.5rem] overflow-y-auto leading-snug">
        <h2 className="mb-1 text-xl font-semibold text-gray-800">Overview</h2>
        <p className="text-base font-normal text-gray-400">
          Dorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu
          turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec
          fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus
          elit sed risus. Maecenas eget condimentum velit, sit amet feugiat
          lectus. Class aptent taciti sociosqu ad litora torquent per conubia
          nostra, per inceptos himenaeos. Praesent auctor purus luctus enim
          egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex.
          Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum
          lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in
          elementum tellus.
          <br />
        </p>
        <h2 className="mb-1 text-xl font-semibold text-gray-800">Overview</h2>
        <p className="text-base font-normal text-gray-400">
          Dorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu
          turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec
          fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus
          elit sed risus. Maecenas eget condimentum velit, sit amet feugiat
          lectus. Class aptent taciti sociosqu ad litora torquent per conubia
          nostra, per inceptos himenaeos. Praesent auctor purus luctus enim
          egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex.
          Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum
          lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in
          elementum tellus.
          <br />
        </p>
        <h2 className="mb-1 text-xl font-semibold text-gray-800">Overview</h2>
        <p className="text-base font-normal text-gray-400">
          Dorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu
          turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec
          fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus
          elit sed risus. Maecenas eget condimentum velit, sit amet feugiat
          lectus. Class aptent taciti sociosqu ad litora torquent per conubia
          nostra, per inceptos himenaeos. Praesent auctor purus luctus enim
          egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex.
          Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum
          lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in
          elementum tellus.
          <br />
        </p>
        <h2 className="mb-1 text-xl font-semibold text-gray-800">Overview</h2>
        <p className="text-base font-normal text-gray-400">
          Dorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu
          turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec
          fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus
          elit sed risus. Maecenas eget condimentum velit, sit amet feugiat
          lectus. Class aptent taciti sociosqu ad litora torquent per conubia
          nostra, per inceptos himenaeos. Praesent auctor purus luctus enim
          egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex.
          Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum
          lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in
          elementum tellus.
          <br />
        </p>
      </div>
      <div className="inline-flex w-full items-center justify-end">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center justify-center gap-1 rounded-full bg-primary px-8 py-3 text-base font-medium capitalize leading-normal text-white shadow"
        >
          accept
        </button>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
