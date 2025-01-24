import { api } from '../../api';
import addStoryToFavorites from './addStoryToFavorites';

const apiWithTag = api.enhanceEndpoints?.({
  addTagTypes: ['Fav-stories'],
});

export const favStoriesApi = apiWithTag.injectEndpoints({
  endpoints: (build: any) => ({
    addStoryToFavorites: addStoryToFavorites(build),
  }),
  overrideExisting: false,
});

export const { useAddStoryToFavoritesMutation }: any = favStoriesApi;
