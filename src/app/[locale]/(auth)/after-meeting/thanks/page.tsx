import { useTranslations } from 'next-intl';

import { SuccessScreen } from '@/components/common/SuccessScreen';

export default function FeedbackConfirmationPage() {
  const t = useTranslations('thanks_page');
  return (
    <SuccessScreen
      title={t('thank_you')}
      notification={t('feedback_value')}
      nameButton={t('go_to_schedule')}
      linkButton={t('back_to_home')}
    />
  );
}
