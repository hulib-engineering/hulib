import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { Logo } from '@/components/Logo';
import { mergeClassnames } from '@/components/private/utils';

const Header = () => {
  const t = useTranslations('Header');

  return (
    <header className="fixed top-0 z-[999] w-full bg-[#f1f4f9bf] px-2 py-0.5 backdrop-blur-[50px] sm:px-[5.625rem] sm:py-6">
      <div className="mx-auto flex items-center justify-between lg:max-w-7xl">
        <div className="relative hidden flex-1 grow items-start pb-[0.26788rem] pt-[0.3125rem] sm:flex">
          <Link href="/">
            <Logo />
          </Link>
        </div>
        <div className="relative flex flex-1 grow items-start pb-[0.26788rem] pt-[0.3125rem] sm:hidden">
          <Link href="/">
            <Logo size="small" />
          </Link>
        </div>
        <div className="relative flex items-center justify-end gap-6">
          <LocaleSwitcher className="shrink" />
          <Link
            href="#newsletter"
            className={mergeClassnames(
              'md:flex items-center justify-center !flex-[0_0_auto] gap-1 rounded-full border border-primary px-8 py-3 hidden',
              'hover:bg-light',
            )}
          >
            <p className="text-base font-medium uppercase leading-normal text-primary">
              {t('contact_us')}
            </p>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
