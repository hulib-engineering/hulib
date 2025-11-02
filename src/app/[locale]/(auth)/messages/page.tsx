'use client';

import { useState } from 'react';

import ChatList from '@/layouts/webapp/Messages/ChatList';
import ChatDetail from '@/layouts/webapp/Messages/ChatDetail';

export default function MessagesPage() {
  const [showDetailOnMobile, setShowDetailOnMobile] = useState(false);

  return (
    <>
      {/* Mobile version (conditional view) */}
      <div className="flex w-full flex-1 flex-col bg-neutral-98 lg:hidden">
        <div className="px-5 py-2 text-xl font-bold leading-7">
          <h6 className="">Your messages</h6>
        </div>
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
      <div className="hidden size-full h-screen flex-1 lg:flex">
        <div className="flex w-[25rem] flex-col border-r border-t border-neutral-90">
          <div className="bg-white px-4 py-5 text-[28px] font-bold leading-9">
            <h4>Messages</h4>
          </div>
          <ChatList />
        </div>

        <ChatDetail />
      </div>
    </>
  );
}
