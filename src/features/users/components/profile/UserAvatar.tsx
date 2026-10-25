import Avatar from '@/components/core/avatar/Avatar';

type UserAvatarProps = {
  photo?: { path: string } | null;
  fallbackSeed?: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  onClick?: () => void;
};

export default function UserAvatar({ photo, fallbackSeed, className, size, onClick }: UserAvatarProps) {
  return (
    <button type="button" onClick={onClick} className="group relative">
      <Avatar
        imageUrl={photo?.path}
        name={fallbackSeed}
        className={className}
        size={size}
      />
    </button>
  );
}
