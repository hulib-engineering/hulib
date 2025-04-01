import { api } from '@/libs/services/api';
import getAllTimeSlots from '@/libs/services/modules/time-slots/getAllTimeSlots';

const apiWithTag = api.enhanceEndpoints?.({
  addTagTypes: ['TimeSlot'],
});

const timeSlotsApi = apiWithTag.injectEndpoints({
  endpoints: (build: any) => ({
    getAllTimeSlots: getAllTimeSlots(build),
  }),
  overrideExisting: false,
});

export const { useGetAllTimeSlotsQuery }: any = timeSlotsApi;
