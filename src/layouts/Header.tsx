import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { Logo } from '@/components/Logo';
import { mergeClassnames } from '@/components/private/utils';

const Header = () => {
  const t = useTranslations('Header');

  return (
    <header className="fixed top-0 z-[999] w-full bg-[#f1f4f9bf] px-[20.625rem] py-6 backdrop-blur-[50px]">
      <div className="relative flex flex-[0_0_auto] items-center justify-between">
        <div className="relative flex flex-1 grow items-start pb-[0.26788rem] pt-[0.3125rem]">
          <Link href="/">
            <Logo />
          </Link>
        </div>
        <div className="relative flex items-center justify-end gap-6">
          <LocaleSwitcher className="shrink" />
          <button
            type="button"
            className={mergeClassnames(
              'flex items-center justify-center !flex-[0_0_auto] gap-1 rounded-full border border-primary px-8 py-3',
              'hover:bg-light',
            )}
          >
            <p className="text-base font-medium uppercase leading-normal text-primary">
              {t('contact_us')}
            </p>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
