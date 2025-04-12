import { api } from '@/libs/services/api';
import createTimeSlots from '@/libs/services/modules/time-slots/createTimeSlots';
import getAllTimeSlots from '@/libs/services/modules/time-slots/getAllTimeSlots';

const apiWithTag = api.enhanceEndpoints?.({
  addTagTypes: ['TimeSlot'],
});

const timeSlotsApi = apiWithTag.injectEndpoints({
  endpoints: (build: any) => ({
    getAllTimeSlots: getAllTimeSlots(build),
    createTimeSlots: createTimeSlots(build),
  }),
  overrideExisting: false,
});

export const { useGetAllTimeSlotsQuery, useCreateTimeSlotsMutation }: any =
  timeSlotsApi;
