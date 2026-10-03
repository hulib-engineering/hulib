import useAppSelector from './useAppSelector';
import { Role } from '@/types/common';

/** Role of the signed-in user, or `undefined` until `auth/me` has resolved. */
const useRoleId = () =>
  useAppSelector(state => state.auth.userInfo?.role?.id);

/** Whether the signed-in user is an admin. */
export const useIsAdmin = () => useRoleId() === Role.ADMIN;

/**
 * Whether to skip a user-scoped query (e.g. `auth/me/favorites`), which the
 * backend answers with a 403 for admin tokens.
 *
 * Also skips while the role is still unknown: `userInfo` starts empty and is
 * filled in by `auth/me`, so checking `isAdmin` alone lets the request race
 * ahead of the role and fire anyway.
 */
export const useSkipUserScopedQuery = () => {
  const roleId = useRoleId();

  return roleId === undefined || roleId === Role.ADMIN;
};

export default useIsAdmin;
