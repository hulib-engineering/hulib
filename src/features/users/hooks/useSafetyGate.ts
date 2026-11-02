import { useCallback } from 'react';

import { getSafetyRequirement, safetyRequirementPath } from '../utils/profile.util';
import { useRouter } from '@/libs/i18nNavigation';
import { useAppSelector } from '@/libs/hooks';

/** Returns a guard: call it before hosting/accepting a meeting; `true` means the user was sent to fill in their birthday / emergency contact. */
export function useSafetyGate() {
  const router = useRouter();
  const userInfo = useAppSelector(state => state.auth.userInfo);

  return useCallback(() => {
    if (!userInfo?.id || !getSafetyRequirement(userInfo)) {
      return false;
    }
    router.push(safetyRequirementPath(userInfo.id));
    return true;
  }, [userInfo, router]);
}
