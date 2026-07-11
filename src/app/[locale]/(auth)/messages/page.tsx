'use client';

import { useState } from 'react';

import { useTranslations } from 'next-intl';
import ChatList from '@/layouts/webapp/Messages/ChatList';
import ChatDetail from '@/layouts/webapp/Messages/ChatDetail';

export default function MessagesPage() {
  const t = useTranslations('Messages');
  const [showDetailOnMobile, setShowDetailOnMobile] = useState(false);

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      {/* Mobile version (conditional view) */}
      <div className="flex size-full flex-col overflow-hidden bg-neutral-98 lg:hidden">
        {!showDetailOnMobile && (
          <div className="shrink-0 px-5 py-2 text-xl font-bold leading-7">
            <h6>{t('your_messages')}</h6>
          </div>
        )}
        {!showDetailOnMobile ? (
          <ChatList onConvoSelect={() => setShowDetailOnMobile(true)} />
        ) : (
          <ChatDetail
            isTypeFixed
            onBack={() => setShowDetailOnMobile(false)}
          />
        )}
      </div>

      {/* Desktop version (always both visible) */}
      <div className="hidden size-full flex-1 overflow-hidden bg-neutral-98 lg:flex">
        <div className="flex h-full w-[25rem] shrink-0 flex-col border-r border-t border-neutral-90 bg-white">
          <div className="shrink-0 bg-white px-4 py-5 text-[28px] font-bold leading-9">
            <h4>{t('messages')}</h4>
          </div>
          <ChatList />
        </div>

        <ChatDetail />
      </div>
    </div>
  );
}
