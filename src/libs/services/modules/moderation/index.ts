import banUser from './banUser';
import warnUser from './warnUser';

import { api } from '@/libs/services/api';

const moderationApiWithTag = api.enhanceEndpoints?.({
  addTagTypes: ['Moderation'],
});

export const moderationApi = moderationApiWithTag.injectEndpoints({
  endpoints: (build: any) => ({
    banUser: banUser(build),
    warnUser: warnUser(build),
  }),
  overrideExisting: false,
});

export const { useBanUserMutation, useWarnUserMutation }: any = moderationApi;
