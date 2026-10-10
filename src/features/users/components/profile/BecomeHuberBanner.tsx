/* eslint-disable jsx-a11y/aria-role */
import { useTranslations } from 'next-intl';

import RoleBadge from './RoleBadge';
import InfoCustomIcon from '@/components/icons/InfoIcon';

export default function BecomeHuberBanner() {
  const t = useTranslations('MyProfile');

  return (
    <div className="flex items-center gap-4 rounded-xl bg-[#FAF7FC] px-6 py-4">
      <RoleBadge role="huber" showLockIcon />
      <div className="flex items-center gap-[10px]">
        <p className="text-xl font-medium text-black">{t('become_huber_banner')}</p>
        <InfoCustomIcon />
      </div>
    </div>
  );
}
