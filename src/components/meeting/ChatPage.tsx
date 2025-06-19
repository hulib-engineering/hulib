import { RealtimeChat } from '@/components/realtime-chat';
import { useAppSelector } from '@/libs/hooks';

export default function ChatPage() {
  const userInfo = useAppSelector((state) => state.auth.userInfo);
  console.log('userInfo', userInfo);

  return (
    <RealtimeChat
      roomName={`my-chat-room-${Date.now()}`}
      username={userInfo.fullName}
    />
  );
}
