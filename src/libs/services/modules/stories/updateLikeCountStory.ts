import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

export enum ChangeCountEnum {
  UP = 'up',
  DOWN = 'down',
}

export type UpdateLikeStoryRequest = {
  id: number;
  type: ChangeCountEnum;
  userId: string;
};

type UpdateStoryResponse = {
  id: number | string;
  likeCount: number;
  likedUserIds: string[];
};

const updateLikeCountStory = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation<UpdateStoryResponse, UpdateLikeStoryRequest>({
    query: ({ id, ...body }) => ({
      url: `/stories/${id}/like`,
      method: 'POST',
      body,
    }),
  });

export default updateLikeCountStory;
