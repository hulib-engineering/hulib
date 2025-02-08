import type { User } from '../user/userType';

export interface StoryReview {
  id: number;
  rating: number;
  numberOfReviews: number;
  title: string;
  comment: string;
  user: User;
  createdAt?: string;
  updatedAt?: string;
}

export interface StoryReviewParams {
  storyId: number;
  page: number;
  limit: number;
}
