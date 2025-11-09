import banUser from './banUser';
import warnUser from './warnUser';
import unbanUser from './unbanUser';
import unwarnUser from './unwarnUser';
import getModerationHistory from './getModerationHistory';

import { api } from '@/libs/services/api';

const moderationApiWithTag = api.enhanceEndpoints?.({
  addTagTypes: ['Users'],
});

export const moderationApi = moderationApiWithTag.injectEndpoints({
  endpoints: (build: any) => ({
    banUser: banUser(build),
    warnUser: warnUser(build),
    unbanUser: unbanUser(build),
    unwarnUser: unwarnUser(build),
    getModerationHistory: getModerationHistory(build),
  }),
  overrideExisting: false,
});

export const {
  useBanUserMutation,
  useWarnUserMutation,
  useUnbanUserMutation,
  useUnwarnUserMutation,
  useGetModerationHistoryQuery,
}: any = moderationApi;
