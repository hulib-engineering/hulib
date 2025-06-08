import { api } from '../../api';
import addStoryToFavorites from './addStoryToFavorites';
import deleteFavoriteStory from './deleteStoryFavorites';
import getFavoritesStory from './getFavoritesStory';

const apiWithTag = api.enhanceEndpoints?.({
  addTagTypes: ['FavoritesStory'],
});

export const favStoriesApi = apiWithTag.injectEndpoints({
  endpoints: (build: any) => ({
    addStoryToFavorites: addStoryToFavorites(build),
    getFavoritesStory: getFavoritesStory(build),
    deleteFavoriteStory: deleteFavoriteStory(build),
  }),
  overrideExisting: false,
});

export const {
  useAddStoryToFavoritesMutation,
  useGetFavoritesStoryQuery,
  useDeleteFavoriteStoryMutation,
}: any = favStoriesApi;
