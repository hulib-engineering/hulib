import { api } from '../../api';
import addTimeSlots from './addTimeSlots';
import getMeeting from './getMeeting';
import getTimeSlots from './getTimeSlot';
import getTimeSlotsById from './getTimeSlotById';

const apiWithTag = api.enhanceEndpoints?.({
  addTagTypes: ['TimeSlots'],
});

const timeSlotsApi = apiWithTag.injectEndpoints({
  endpoints: (build: any) => ({
    getTimeSlots: getTimeSlots(build),
    getTimeSlotsById: getTimeSlotsById(build),
    addTimeSlots: addTimeSlots(build),
    getMeeting: getMeeting(build),
  }),
  overrideExisting: false,
});

export const {
  useGetTimeSlotsQuery,
  useGetTimeSlotsByIdQuery,
  useAddTimeSlotsMutation,
  useGetMeetingQuery,
}: any = timeSlotsApi;
