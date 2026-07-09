'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { HuberCTACard } from '@/components/home';

export default function HuberCTA() {
  const router = useRouter();
  const t = useTranslations('Home');
  return (
    <div className="relative inset-x-1/2 -mb-8 h-[403px] w-screen overflow-hidden bg-gradient-to-t from-[#fdf3ce] to-transparent -translate-x-1/2 md:h-[532px]">
      {/* Top fade into page background */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 hidden h-16 bg-gradient-to-b from-white/80 to-transparent md:block lg:h-24" />

      {/* Desktop background image — matches Figma: frame at bottom-[-475px], image overflows */}
      <div className="absolute bottom-[-475px] left-1/2 z-0 hidden h-[983px] w-[1216px] overflow-hidden -translate-x-1/2 md:block">
        <Image
          src="/assets/images/backgrounds/cta-bg.png"
          alt=""
          fill
          className="object-cover object-top"
          sizes="1216px"
          aria-hidden
        />
      </div>

      {/* Mobile background image — Figma: 628×508 frame at top:24px, center-cropped */}
      <div className="absolute left-1/2 top-6 z-0 h-[508px] w-[628px] overflow-hidden -translate-x-1/2 md:hidden">
        <Image
          src="/assets/images/backgrounds/cta-bg.png"
          alt=""
          fill
          className="object-cover object-top"
          sizes="628px"
          aria-hidden
        />
      </div>

      {/* CTA Card */}
      <div className="absolute left-1/2 top-12 z-20 justify-center -translate-x-1/2">
        <HuberCTACard
          title={t('short_descriptions.become_member')}
          subtitle={t('short_descriptions.subtitle')}
          buttonLabel={t('short_descriptions.create_new_book')}
          onClick={() => router.push('/register-huber/policy')}
        />
      </div>
    </div>
  );
}
