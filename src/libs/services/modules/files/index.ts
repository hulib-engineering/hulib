import { api } from '../../api';
import upload from './upload';

const fileApiWithTag = api.enhanceEndpoints?.({
  addTagTypes: ['Files'],
});

const fileApi = fileApiWithTag.injectEndpoints({
  endpoints: (build: any) => ({
    upload: upload(build),
  }),
  overrideExisting: false,
});

export const { useUploadMutation }: any = fileApi;
