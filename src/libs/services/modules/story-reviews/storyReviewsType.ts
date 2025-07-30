import type { User } from '@/features/users/types';

export type StoryReview = {
  id: number;
  rating: number;
  numberOfReviews: number;
  title: string;
  comment: string;
  user: User;
  createdAt?: string;
  updatedAt?: string;
};

export type StoryReviewParams = {
  storyId: number;
  page: number;
  limit: number;
};
