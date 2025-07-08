import { api } from '../../api';
import getStickers from './getStickers';

const apiWithTag = api.enhanceEndpoints?.({
  addTagTypes: ['Stickers'],
});

export const stickersApi = apiWithTag.injectEndpoints({
  endpoints: (build: any) => ({
    getStickers: getStickers(build),
  }),
  overrideExisting: false,
});

export const { useGetStickersQuery }: any = stickersApi;
