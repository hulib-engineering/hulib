import { api } from '../../api';
import createNewReadingSession from './createNewReadingSession';

const apiWithTag = api.enhanceEndpoints?.({
  addTagTypes: ['ReadingSession'],
});

const readingSessionApi = apiWithTag.injectEndpoints({
  endpoints: (build: any) => ({
    createNewReadingSession: createNewReadingSession(build),
  }),
  overrideExisting: false,
});

export const { useCreateNewReadingSessionMutation }: any = readingSessionApi;
