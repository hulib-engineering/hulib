import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import type { Story } from '@storybook/react';

// import type { Story } from './storiesType';

export enum ChangeCountEnum {
  UP = 'up',
  DOWN = 'down',
}

export type UpdateLikeStoryRequest = {
  id: number;
  type: ChangeCountEnum;
};

type UpdateStoryResponse = {} & Story;

const updateLikeCountStory = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation<UpdateStoryResponse, UpdateLikeStoryRequest>({
    query: ({ id, ...body }) => ({
      url: `/stories/${id}/like`,
      method: 'POST',
      body,
    }),
    invalidatesTags: (_result, _error, { id }) => [
      { type: 'Story' as const, id },
    ],
  });

export default updateLikeCountStory;
