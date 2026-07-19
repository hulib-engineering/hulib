'use client';

import {
  Books,
  House,
  SignOut,
  UserCircle,
  VideoCamera,
  X,
} from '@phosphor-icons/react';
import { signOut } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import NiceAvatar, { genConfig } from 'react-nice-avatar';
import { useState } from 'react';

import Modal from '@/components/Modal';
import { mergeClassnames } from '@/components/core/private/utils';
import StoryForm from '@/features/stories/components/StoryForm';
import { useAppSelector } from '@/libs/hooks';
import { Env } from '@/libs/Env.mjs';
import { Role } from '@/types/common';
import { Link, usePathname } from '@/libs/i18nNavigation';

const LogoIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M47.05 39.3511C46.4821 32.8976 40.4088 29.7821 37.7552 28.715C37.6273 28.664 37.5143 28.5816 37.4267 28.4754C37.3391 28.3692 37.2797 28.2427 37.254 28.1076C37.2282 27.9724 37.237 27.8329 37.2794 27.702C37.3219 27.5711 37.3966 27.453 37.4968 27.3586C38.2763 26.6276 39.0658 25.8866 39.813 25.1923C43.8764 21.4214 46.2226 16.095 46.0211 10.5572C45.9231 7.8456 45.2293 5.32761 43.5423 3.77876C39.5335 0.106919 34.5303 0.663258 31.2008 4.42634C30.1172 5.6453 29.1351 6.95074 28.2644 8.32961C26.9815 10.3925 25.9047 12.5878 25.1798 14.91C24.0908 18.3882 23.1643 20.292 22.3458 21.1866C21.3948 22.227 19.0397 23.9494 17.1221 22.6932C15.2046 21.437 15.2458 18.8211 15.2881 12.9606C15.3304 7.1001 14.5988 4.81689 13.4441 2.98876C12.2893 1.16063 9.68806 -0.556237 6.4053 0.169229C3.12254 0.894696 1.89318 3.80212 1.89318 3.80212C-1.01654 10.9388 1.26402 16.3387 4.52117 19.1571C7.77831 21.9755 10.8684 22.3705 13.061 22.3627C13.6378 22.3627 14.1746 22.375 14.4685 22.464C15.3705 22.7355 15.8783 23.3252 16.1712 24.0217C16.5542 24.933 16.3939 25.7508 16.0754 26.5642C14.4507 30.6422 11.3985 30.9593 6.13136 35.0205C0.452242 39.3956 -1.58222 47.8164 1.31525 52.128C4.21271 56.4396 8.48765 56.4752 11.2481 55.4504C14.0086 54.4257 16.7758 52.464 19.3058 50.6114C21.8358 48.7588 22.5351 46.8873 25.4537 47.0653C28.3724 47.2433 30.85 50.2264 32.615 52.3895C34.38 54.5525 37.1472 53.7102 37.1472 53.7102C41.8698 52.454 47.7783 47.6316 47.05 39.3511ZM24.0351 30.4118C22.9215 32.1042 21.2679 32.981 20.3347 32.3702C19.4016 31.7593 19.5475 29.8911 20.6588 28.1987C21.7701 26.5063 23.426 25.6284 24.3591 26.2393C25.2923 26.8501 25.1464 28.7183 24.0351 30.4118Z"
      fill="#0057D7"
    />
  </svg>
);

const MobileBottomNav = () => {
  const t = useTranslations('LandingPage');
  const tHeader = useTranslations('HeaderWebApp');
  const tMyProfile = useTranslations('MyProfile');
  const currentLocale = useLocale();
  const pathname = usePathname();

  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const userInfo = useAppSelector(state => state.auth.userInfo);
  const avatarUrl = useAppSelector(state => state.auth.avatarUrl);
  const id = userInfo?.id;
  const fullName = userInfo?.fullName;
  const role = userInfo?.role;

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const closePopup = () => setIsProfilePopupOpen(false);

  const renderAvatar = () => {
    const avatarSize = 'size-6';
    if (role?.id === Role.ADMIN || avatarUrl) {
      return (
        <div
          className={`${avatarSize} rounded-full bg-cover bg-center`}
          style={{
            backgroundImage: `url('${role?.id === Role.ADMIN ? '/assets/images/avatars/admin-ava.png' : avatarUrl}')`,
          }}
        />
      );
    }
    return (
      <NiceAvatar
        className={`${avatarSize} rounded-full`}
        {...genConfig(fullName ?? String(id ?? 'huber'))}
      />
    );
  };

  const navItems = [
    {
      label: t('bottomNav.home'),
      icon: <LogoIcon size={24} />,
      href: '/',
    },
    {
      label: t('navigation.bookshelf'),
      icon: <Books size={24} />,
      href: '/explore-story',
    },
    {
      label: t('bottomNav.profile'),
      icon: renderAvatar(),
      onClick: () => setIsProfilePopupOpen(true),
    },
  ];

  const handleCreateStoryClick = () => {
    closePopup();
    setIsCreateModalOpen(true);
  };

  return (
    <>
      {/* Profile popup */}
      {isProfilePopupOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={closePopup}
            aria-hidden="true"
          />
          <div
            className={mergeClassnames(
              'fixed inset-x-0 z-50 mx-auto w-[calc(100%-32px)] max-w-sm rounded-2xl bg-white p-4 shadow-lg transition-all duration-300 lg:hidden',
              isProfilePopupOpen
                ? 'translate-y-0 opacity-100'
                : 'translate-y-full opacity-0',
            )}
            style={{ bottom: '64px' }}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-base font-semibold text-neutral-10">
                {t('bottomNav.profile')}
              </span>
              <button
                type="button"
                className="rounded-full p-1 text-neutral-30 hover:bg-neutral-90"
                onClick={closePopup}
              >
                <X size={20} weight="bold" />
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {role?.id === Role.ADMIN
                ? (
                    <>
                      {/* Dashboard */}
                      <Link
                        href="/admin/awaiting-stories"
                        className="flex items-center gap-x-3 rounded-xl p-3 text-neutral-10 hover:bg-neutral-90"
                        onClick={closePopup}
                      >
                        <House size={20} />
                        <span className="text-sm font-medium">{tHeader('dashboard')}</span>
                      </Link>

                      {/* Sign Out */}
                      <button
                        type="button"
                        className="flex items-center gap-x-3 rounded-xl p-3 text-red-50 hover:bg-neutral-90"
                        onClick={() => {
                          closePopup();
                          signOut({
                            callbackUrl: `${Env.NEXT_PUBLIC_APP_URL}${currentLocale === 'vi' ? '' : '/en'}/admin/auth/login`,
                          });
                        }}
                      >
                        <SignOut size={20} />
                        <span className="text-sm font-medium">{tHeader('sign_out')}</span>
                      </button>
                    </>
                  )
                : (
                    <>
                      {/* My Profile */}
                      <Link
                        href={`/users/${id}`}
                        className="flex items-center gap-x-3 rounded-xl p-3 text-neutral-10 hover:bg-neutral-90"
                        onClick={closePopup}
                      >
                        <UserCircle size={20} />
                        <span className="text-sm font-medium">{tHeader('my_profile')}</span>
                      </Link>

                      {/* Create New Story */}
                      <button
                        type="button"
                        className="flex h-[44px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#007CBE] to-[#8845C6] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#14144a]"
                        onClick={handleCreateStoryClick}
                      >
                        <Image
                          src="/assets/images/register-huber/white_book.png"
                          alt=""
                          width={18}
                          height={18}
                          className="object-contain brightness-[10]"
                        />
                        {tMyProfile('create_new_story')}
                      </button>

                      {/* My Meetings */}
                      <Link
                        href="/my-schedule"
                        className="flex items-center gap-x-3 rounded-xl p-3 text-neutral-10 hover:bg-neutral-90"
                        onClick={closePopup}
                      >
                        <VideoCamera size={20} />
                        <span className="text-sm font-medium">{tHeader('my_schedule')}</span>
                      </Link>

                      {/* Sign Out */}
                      <button
                        type="button"
                        className="flex items-center gap-x-3 rounded-xl p-3 text-red-50 hover:bg-neutral-90"
                        onClick={() => {
                          closePopup();
                          signOut({
                            callbackUrl: `${Env.NEXT_PUBLIC_APP_URL}${currentLocale === 'vi' ? '' : '/en'}${role?.id === Role.ADMIN ? '/admin/auth/login' : '/auth/login'}`,
                          });
                        }}
                      >
                        <SignOut size={20} />
                        <span className="text-sm font-medium">{tHeader('sign_out')}</span>
                      </button>
                    </>
                  )}
            </div>
          </div>
        </>
      )}

      {/* Create Story Modal */}
      <Modal
        open={isCreateModalOpen}
        disableClosingTrigger
        onClose={() => setIsCreateModalOpen(false)}
      >
        <Modal.Backdrop />
        <Modal.Panel className="w-full shadow-none lg:w-5/6 lg:max-w-6xl">
          <div className="relative">
            <button
              type="button"
              className="absolute right-4 top-0 z-10 rounded-full text-neutral-30 hover:bg-neutral-90 md:top-4"
              onClick={() => setIsCreateModalOpen(false)}
            >
              <X size={20} weight="bold" />
            </button>
            <StoryForm
              type="create"
              onSucceed={() => setIsCreateModalOpen(false)}
              onCancel={() => setIsCreateModalOpen(false)}
            />
          </div>
        </Modal.Panel>
      </Modal>

      {/* Bottom Nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-90 bg-white lg:hidden">
        <div className="flex size-full items-center justify-around px-2">
          {navItems.map(item => (
            item.href
              ? (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex flex-col items-center gap-0.5 px-3 py-1"
                  >
                    <div
                      className={
                        isActive(item.href)
                          ? 'text-primary-50'
                          : 'text-neutral-30'
                      }
                    >
                      {item.icon}
                    </div>
                    <span
                      className={`text-[10px] font-medium leading-3 ${
                        isActive(item.href)
                          ? 'text-primary-50'
                          : 'text-neutral-30'
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                )
              : (
                  <button
                    key={item.label}
                    type="button"
                    className="flex flex-col items-center gap-0.5 px-3 py-1"
                    onClick={item.onClick}
                  >
                    <div className="text-neutral-30">
                      {item.icon}
                    </div>
                    <span className="text-[10px] font-medium leading-3 text-neutral-30">
                      {item.label}
                    </span>
                  </button>
                )
          ))}
        </div>
      </nav>
    </>
  );
};

export default MobileBottomNav;
