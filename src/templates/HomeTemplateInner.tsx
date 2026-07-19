'use client';

import { useSession } from 'next-auth/react';
import { type ReactNode, useEffect, useState } from 'react';

import PublicHeader from './PublicHeader';
import { usePathname } from '@/libs/i18nNavigation';
import Header from '@/app/[locale]/(auth)/_components/Header';
import FooterWebApp from '@/app/[locale]/(auth)/_components/FooterWebApp';
import CustomToastifyContainer from '@/components/CustomToastifyContainer';
import { mergeClassnames } from '@/components/core/private/utils';
import { poppins } from '@/styles/fonts';
import MessengerWidget from '@/layouts/webapp/MultipleChatWidget';
import { useAppDispatch } from '@/libs/hooks';
import FirstBookCreatedModal from '@/features/stories/components/FirstBookCreatedModal';
import {
  useGetPersonalInfoQuery,
  useMarkHuberOnboardingSeenMutation,
} from '@/libs/services/modules/auth';
import { setAvatarUrl, setUserInfo } from '@/libs/store/authentication';
import Modal from '@/components/Modal';

export default function HomeTemplateInner({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const isAuthenticated = !!session;

  const { data: personalInfo } = useGetPersonalInfoQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [markSeen] = useMarkHuberOnboardingSeenMutation();

  const [isFirstBookModalOpen, setIsFirstBookModalOpen] = useState(false);

  useEffect(() => {
    if (personalInfo) {
      dispatch(setUserInfo(personalInfo));
      dispatch(setAvatarUrl(personalInfo.photo));
      if (personalInfo?.role?.name === 'Huber' && !personalInfo?.hasSeenHuberOnboarding) {
        setIsFirstBookModalOpen(true);
      }
    }
  }, [personalInfo, dispatch]);

  const handleCloseModal = () => {
    setIsFirstBookModalOpen(false);
    markSeen(personalInfo?.id);
  };

  if (isAuthenticated) {
    return (
      <div className={mergeClassnames(poppins.className, 'relative antialiased h-screen flex flex-col')}>
        <div className="flex size-full flex-col">
          <Header />
          <main className={mergeClassnames('flex-1 bg-neutral-98', !pathname.includes('messages') && 'overflow-y-auto')}>
            <div className={mergeClassnames('bg-neutral-98', pathname.includes('messages') ? 'h-full' : 'min-h-[calc(100vh-410px)]')}>
              {children}
            </div>
            {!pathname.includes('messages') && <FooterWebApp />}
          </main>
          {!pathname.includes('messages') && <MessengerWidget />}
        </div>
        <CustomToastifyContainer />
        {/* FirstBookCreatedModal */}
        <Modal
          open={isFirstBookModalOpen}
          onClose={handleCloseModal}
        >
          <Modal.Backdrop />
          <Modal.Panel className="w-full shadow-none lg:w-5/6 lg:max-w-6xl">
            <FirstBookCreatedModal
              onClose={handleCloseModal}
            />
          </Modal.Panel>

        </Modal>

      </div>
    );
  }

  return (
    <div className={mergeClassnames(poppins.className, 'relative antialiased min-h-screen flex flex-col')}>
      <PublicHeader />
      <main className="flex-1 bg-neutral-98 pt-14 lg:pt-16">
        <div className="min-h-[calc(100vh-410px)]">
          {children}
        </div>
        <FooterWebApp />
      </main>
      <CustomToastifyContainer />
    </div>
  );
}

export { HomeTemplateInner };
