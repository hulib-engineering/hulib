import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

export type UserFeedbackItem = {
  id: number;
  content: string;
  rating: number;
  createdAt: string;
  feedbackBy: {
    id: number;
    fullName: string;
    photo?: string;
  };
};

export type GetUserFeedbackParams = {
  userId: number;
  page?: number;
  limit?: number;
};

export type GetUserFeedbackResponse = {
  data: UserFeedbackItem[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
};

export const FEEDBACK_PAGE_LIMIT = 5;

const getUserFeedback = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.query<GetUserFeedbackResponse, GetUserFeedbackParams>({
    query: ({ userId, page = 1, limit = FEEDBACK_PAGE_LIMIT }) => ({
      url: `users/${userId}/feedbacks`,
      params: { page, limit },
    }),
    providesTags: (result, _err, { userId }) =>
      result
        ? [
            ...result.data.map(({ id }) => ({ type: 'UserFeedback' as const, id })),
            { type: 'UserFeedback' as const, id: `USER-${userId}` },
          ]
        : [{ type: 'UserFeedback' as const, id: `USER-${userId}` }],
  });

export default getUserFeedback;
