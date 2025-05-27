import dynamic from 'next/dynamic';

// Dynamic import để dùng component client
const AgoraVideoCall = dynamic(() => import('./components/AgoraVideoCall'), {
  ssr: false,
});

export default function ReadingPage() {
  const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID || '';

  return (
    <div className="flex size-full items-center justify-center">
      <AgoraVideoCall appId={appId} />
    </div>
  );
}
