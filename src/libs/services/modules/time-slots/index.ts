import createTimeslots from './createTimeslots';
import getTimeslots from './getTimeslots';
import getTimeslotsByHuber from './getTimeslotsByHuber';

import { api } from '@/libs/services/api';

const apiWithTag = api.enhanceEndpoints?.({
  addTagTypes: ['Timeslot'],
});

export const timeslotApi = apiWithTag.injectEndpoints({
  endpoints: (build: any) => ({
    getTimeslots: getTimeslots(build),
    createTimeslots: createTimeslots(build),
    getTimeslotsByHuber: getTimeslotsByHuber(build),
  }),
  overrideExisting: false,
});

export const {
  useCreateTimeslotsMutation,
  useGetTimeslotsByHuberQuery,
}: any = timeslotApi;
