import { PublishStatusEnum } from '@/libs/services/modules/stories/storiesType';

export const AWAITING_STORIES_QUERY_ARGS = {
  page: 1,
  limit: 6,
  publishStatus: PublishStatusEnum.DRAFT,
  sort: [{ orderBy: 'createdAt', order: 'DESC' as const }],
};
