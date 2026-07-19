'use client';
import { List, X } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Link, usePathname, useRouter } from '@/libs/i18nNavigation';
import { Logo } from '@/components/Logo';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { mergeClassnames } from '@/components/core/private/utils';
import Button from '@/components/core/button/Button';

export default function PublicHeader() {
  const t = useTranslations('LandingPage');
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);
  return (
    <>
      <header className="fixed top-0 z-[999] flex h-14 w-screen items-center bg-white shadow-sm lg:h-16">
        <div className="mx-auto flex w-full items-center justify-between px-4">
          <div className="flex items-center gap-x-6">
            <Link href="/" aria-label="Go to homepage">
              <span className="hidden lg:block">
                <Logo />
              </span>
              <span className="lg:hidden">
                <Logo size="small" />
              </span>
            </Link>
            <div className="hidden lg:block">
              <Link href="/explore-story" className="p-3">
                {t('navigation.bookshelf')}
              </Link>
              <Link href="/about" className="p-3">
                {t('navigation.about_us')}
              </Link>
            </div>
          </div>
          <div className="hidden items-center gap-3 lg:flex">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/auth/login')}
            >
              {t('button.sign_in')}
            </Button>
            <Button
              variant="fill"
              size="sm"
              onClick={() => router.push('/auth/register')}
            >
              {t('button.sign_up')}
            </Button>
            <LocaleSwitcher />
          </div>
          <div className="flex items-center gap-2 lg:hidden">
            <LocaleSwitcher />
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full p-2 text-neutral-20"
              aria-label="Open menu"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen(true)}
            >
              <List size={24} weight="bold" />
            </button>
          </div>
        </div>
      </header>
      <div
        className={mergeClassnames(
          'fixed inset-0 z-[1000] bg-black/40 transition-opacity duration-200 lg:hidden',
          isMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />
      <aside
        className={mergeClassnames(
          'fixed right-0 top-0 z-[1001] h-screen w-[82%] max-w-[320px] bg-white shadow-xl transition-transform duration-300 lg:hidden',
          isMenuOpen ? 'translate-x-0' : 'translate-x-full',
        )}
        aria-label="Mobile menu"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-neutral-90 p-4">
            <Logo size="small" />
            <button
              type="button"
              className="rounded-full p-2 text-neutral-20"
              aria-label="Close menu"
              onClick={() => setIsMenuOpen(false)}
            >
              <X size={20} weight="bold" />
            </button>
          </div>
          <div className="flex flex-1 flex-col gap-2 p-4">
            <Link
              href="/explore-story"
              className="rounded-lg px-2 py-3 text-base font-medium leading-5 text-neutral-20"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('navigation.bookshelf')}
            </Link>
            <Link
              href="/about"
              className="rounded-lg px-2 py-3 text-base font-medium leading-5 text-neutral-20"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('navigation.about_us')}
            </Link>
            <div className="flex flex-col gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => router.push('/auth/login')}
              >
                {t('button.sign_in')}
              </Button>
              <Button
                variant="fill"
                size="sm"
                className="w-full"
                onClick={() => router.push('/auth/register')}
              >
                {t('button.sign_up')}
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
