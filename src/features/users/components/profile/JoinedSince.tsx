import { Timer } from '@phosphor-icons/react';
import { useLocale, useTranslations } from 'next-intl';

type JoinedSinceProps = {
  date?: string | null;
};

export default function JoinedSince({ date }: JoinedSinceProps) {
  const t = useTranslations('MyProfile');
  const locale = useLocale();

  if (!date) {
    return null;
  }

  const formatted = new Date(date).toLocaleDateString(
    locale === 'en' ? 'en-US' : 'vi-VN',
    { day: 'numeric', month: 'long', year: 'numeric' },
  );

  return (
    <p className="flex items-center gap-2 text-sm text-neutral-10">
      <Timer size={18} weight="bold" />
      {t('joined_since', { date: formatted })}
    </p>
  );
}
