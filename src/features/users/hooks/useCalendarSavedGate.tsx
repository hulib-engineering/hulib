'use client';

import { useCallback, useState } from 'react';
import { CalendarCheck } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';

import { getSafetyRequirement, safetyRequirementPath } from '../utils/profile.util';
import Button from '@/components/core/button/Button';
import Modal from '@/components/Modal';
import { useAppSelector } from '@/libs/hooks';
import { useRouter } from '@/libs/i18nNavigation';

/**
 * Call the returned `check` right after the personal calendar was saved. When the user still owes a birthday or an
 * emergency contact, it shows the "calendar saved" popup whose button sends them to their profile to fill it in,
 * and returns `true` so the caller can skip its own success handling. Render the returned `modal` once.
 */
export function useCalendarSavedGate() {
  const t = useTranslations('Common');
  const router = useRouter();
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const [open, setOpen] = useState(false);

  const check = useCallback(() => {
    if (!userInfo?.id || !getSafetyRequirement(userInfo)) {
      return false;
    }
    setOpen(true);
    return true;
  }, [userInfo]);

  // The popup has a single way out: the profile, where the safety popup asks for the missing info.
  const goToProfile = () => {
    setOpen(false);
    if (userInfo?.id) {
      router.push(safetyRequirementPath(userInfo.id));
    }
  };

  const modal = (
    <Modal open={open} onClose={goToProfile}>
      <Modal.Backdrop className="bg-[#2E3032]/50" />
      <Modal.Panel className="flex w-full max-w-[500px] flex-col items-center gap-4 rounded-2xl p-6">
        {/* ponytail: icon stands in for the pink calendar illustration from Figma until the asset is exported */}
        <CalendarCheck size={96} weight="duotone" className="text-primary-50" />
        <h6 className="text-center text-[28px] font-medium leading-9 text-primary-50">{t('calendar_saved_title')}</h6>
        <p className="text-center text-base text-neutral-10">{t('calendar_saved_description')}</p>
        <Button fullWidth className="mt-2" onClick={goToProfile}>
          {t('calendar_saved_action')}
        </Button>
      </Modal.Panel>
    </Modal>
  );

  return { check, modal };
}
