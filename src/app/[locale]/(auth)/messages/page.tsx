import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { getTranslations } from 'next-intl/server';
import * as React from 'react';

import { authOptions } from '@/libs/NextAuthOption';

// 👇 dynamically import ChatDetail to run on client only
const ChatDetail = dynamic(
  () => import('@/layouts/webapp/Messages/ChatDetail'),
  {
    ssr: false,
  },
);
const ChatList = dynamic(() => import('@/layouts/webapp/Messages/ChatList'), {
  ssr: false,
});

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'Messages' });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function Index() {
  const session = await getServerSession(authOptions);

  if (!session) return notFound();

  return (
    <div className="flex w-full flex-1">
      <div className="flex h-[738px] flex-col border-r border-t border-neutral-90 bg-white">
        <div className="px-4 py-5">
          <h4 className="text-[28px] font-bold leading-9 text-black">
            Messages
          </h4>
        </div>
        <ChatList />
      </div>
      <ChatDetail />
    </div>
  );
}
