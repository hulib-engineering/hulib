import { useAppDispatch } from '@/libs/hooks';
import { openChat } from '@/libs/store/messenger';

export function useOpenHuberChat() {
  const dispatch = useAppDispatch();

  return (humanBook: any) => {
    if (!humanBook) {
      return;
    }
    dispatch(
      openChat({
        id: humanBook.id,
        name: humanBook.fullName,
        avatarUrl: humanBook.photo?.path,
        isOpen: true,
        isMinimized: false,
        unread: 0,
      }),
    );
  };
}
