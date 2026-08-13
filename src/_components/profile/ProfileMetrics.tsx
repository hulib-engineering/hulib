import { BooksIcon, HeartIcon, VideoCameraIcon } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';

type ProfileMetricsProps = {
  storiesCount?: number;
  conversationsCount?: number;
  rating?: number | null;
  ratingCount?: number;
  followersCount?: number;
};

function MetricItem({
  icon,
  value,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  value: number;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-1 items-center gap-1 rounded-lg px-1 lg:gap-2 lg:px-2">
      <div className="hidden size-10 shrink-0 items-center justify-center lg:flex">{icon}</div>
      <span className="text-2xl font-medium text-neutral-10 lg:text-4xl">{value > 0 ? value : '-'}</span>
      <div className="flex flex-col lg:gap-1">
        <span className="text-xs font-medium text-neutral-10 lg:text-sm">{title}</span>
        {subtitle && <span className="text-[10px] text-neutral-10 lg:text-xs">{subtitle}</span>}
      </div>
    </div>
  );
}

function Divider() {
  return <div className="hidden w-px self-stretch bg-neutral-variant-90 lg:block" />;
}

export default function ProfileMetrics({
  storiesCount = 0,
  conversationsCount = 0,
  rating,
  ratingCount = 0,
}: ProfileMetricsProps) {
  const t = useTranslations('MyProfile.profile_metrics');

  return (
    <div className="grid grid-cols-2 gap-y-4 py-2 lg:flex lg:items-center lg:justify-between lg:gap-4 lg:border-t lg:border-neutral-variant-90 lg:py-4">
      <MetricItem
        icon={<BooksIcon size={40} className="text-primary-50" />}
        value={storiesCount}
        title={t('stories_title')}
        subtitle={t('stories_sub')}
      />
      <Divider />
      <MetricItem
        icon={<VideoCameraIcon size={40} className="text-primary-50" />}
        value={conversationsCount}
        title={t('conversations_title')}
        subtitle={t('conversations_sub')}
      />
      <Divider />
      <MetricItem
        icon={<HeartIcon size={40} className="text-pink-40" weight="fill" />}
        value={rating ?? 0}
        title={t('rating_title')}
        subtitle={t('rating_sub', { count: ratingCount })}
      />
    </div>
  );
}
