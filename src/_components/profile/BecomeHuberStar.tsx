import { useTranslations } from 'next-intl';
import { strongMessage } from '@/utils/i18NRichTextUtils';

type BecomeHuberStarProps = {
  current: number;
  total?: number;
};

function StarBadge() {
  return (
    <div className="w-fit rounded-lg bg-gradient-to-b from-[#B6E8F8] to-[#D1BDF9] px-2 py-1 lg:p-2">
      <span className="text-xs font-medium text-primary-50 lg:text-xl">Huber Sao 🔒</span>
    </div>
  );
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex flex-1 items-center gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-4 flex-1 rounded-sm ${i < current ? 'bg-gradient-to-b from-[#B3EAF7] to-[#D2BCFB]' : 'bg-[#C7C9CB]'}`}
        />
      ))}
    </div>
  );
}

export default function BecomeHuberStar({ current, total = 5 }: BecomeHuberStarProps) {
  const t = useTranslations('MyProfile');

  if (current === total) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl bg-[#FAF7FC] p-2 lg:flex-row lg:items-center lg:gap-4 lg:rounded-2xl lg:px-5 lg:py-4">
      <StarBadge />
      <div className="flex flex-1 flex-col gap-2">
        <p className="text-sm font-medium text-black lg:text-base">{t.rich('become_huber_star_title', { strong: strongMessage() })}</p>
        <div className="flex items-center gap-1">
          <span className="shrink-0 text-xs text-neutral-40">{t('become_huber_star_progress')}</span>
          <ProgressBar current={current} total={total} />
          <span className="shrink-0 text-xs text-neutral-40">
            {current}
            /
            {total}
          </span>
        </div>
      </div>
    </div>
  );
}
