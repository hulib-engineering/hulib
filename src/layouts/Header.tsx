import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Logo } from '@/components/Logo';
import { mergeClassnames } from '@/components/private/utils';

const Header = () => {
  const t = useTranslations('Header');

  return (
    <header className="fixed top-0 z-[999] flex w-full flex-col items-center justify-center bg-[#f1f4f9bf] px-[5.625rem] py-6 backdrop-blur-[50px]">
      <div className="flex w-[78.75rem] items-center justify-between">
        <div className="flex shrink grow basis-0 items-start">
          <div className="pb-[0.26788rem] pt-[0.3125rem]">
            <Link href="/">
              <Logo />
            </Link>
          </div>
        </div>
        <div className="flex shrink grow basis-0 flex-col items-end justify-center">
          <button
            type="button"
            className={mergeClassnames(
              'flex items-center justify-center gap-1 rounded-[2rem] border border-primary px-8 py-3',
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
