import Image from 'next/image';
import { useTranslations } from 'next-intl';
import React from 'react';

type AlertProps = {
  type?: 'success' | 'info';
  sessionUrl?: string;
  className?: string;
};

const Alert: React.FC<AlertProps> = ({
  type = 'success',
  sessionUrl,
  className = '',
}) => {
  const t = useTranslations('Meeting');

  const variants = {
    success: {
      container: 'bg-green-98 border-green-80 text-green-40',
      iconSrc: '/assets/icons/meeting/Check.svg',
      iconColor: 'text-green-60',
      message: t('survey_submitted_successfully'),
    },
    info: {
      container: 'bg-orange-98 border-orange-60 text-orange-40',
      iconSrc: '/assets/icons/meeting/VideoCamera.svg',
      iconColor: 'text-orange-40',
      message: t('you_have_meeting_now'),
    },
  };

  const handleDetailClick = () => {
    if (sessionUrl) {
      window.open(sessionUrl, '_blank');
    }
  };

  const variant = variants[type];

  return (
    <div
      className={`flex items-center gap-3 rounded-full border px-4 py-2 ${variant.container} ${className}`}
    >
      <Image
        src={variant.iconSrc}
        alt={`${type} icon`}
        width={20}
        height={20}
        className={`shrink-0 ${variant.iconColor}`}
      />

      <div className="flex-1">
        <span className="text-base font-normal">{variant.message}</span>
      </div>

      {type === 'info' && sessionUrl && (
        <div className="shrink-0">
          <button
            type="button"
            onClick={handleDetailClick}
            className="text-sm font-normal text-primary-60 underline"
          >
            {t('detail')}
          </button>
        </div>
      )}
    </div>
  );
};

export default Alert;
