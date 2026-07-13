import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import { ChangeCountEnum } from '@/libs/services/modules/stories/updateLikeCountStory';

const shareStory = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation<void, number>({
    query: id => ({
      url: `stories/${id}/share`,
      method: 'POST',
      body: {
        type: ChangeCountEnum.UP,
      },
    }),
  });

export default shareStory;
