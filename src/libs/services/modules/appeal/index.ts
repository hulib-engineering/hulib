import appealModeration from './appealModeration';
import respondAppeal from './respondAppeal';

import { api } from '@/libs/services/api';

const appealApiWithTag = api.enhanceEndpoints?.({
  addTagTypes: ['Appeal'],
});

export const appealApi = appealApiWithTag.injectEndpoints({
  endpoints: (build: any) => ({
    appeal: appealModeration(build),
    respondAppeal: respondAppeal(build),
  }),
  overrideExisting: false,
});

export const { useAppealMutation, useRespondAppealMutation }: any = appealApi;
