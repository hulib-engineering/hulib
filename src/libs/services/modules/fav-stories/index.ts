import { api } from '../../api';
import addStoryToFavorites from './addStoryToFavorites';
import getFavoritesStory from './getFavoritesStory';

const apiWithTag = api.enhanceEndpoints?.({
  addTagTypes: ['FavoritesStory'],
});

export const favStoriesApi = apiWithTag.injectEndpoints({
  endpoints: (build: any) => ({
    addStoryToFavorites: addStoryToFavorites(build),
    getFavoritesStory: getFavoritesStory(build),
  }),
  overrideExisting: false,
});

export const {
  useAddStoryToFavoritesMutation,
  useGetFavoritesStoryQuery,
}: any = favStoriesApi;
