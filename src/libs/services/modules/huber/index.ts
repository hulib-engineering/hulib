import { api } from '../../api';
import getHubers from './getHubers';

const apiWithTag = api.enhanceEndpoints?.({
  addTagTypes: ['Hubers'],
});

const hubersApi = apiWithTag.injectEndpoints({
  endpoints: (build: any) => ({
    getHubers: getHubers(build),
  }),
  overrideExisting: false,
});

export const { useGetHubersQuery }: any = hubersApi;
