import type { FileType } from '../files/fileType';
import type { Topic } from '../topics/topicType';
import type { User } from '../user/userType';

export interface StoriesParams {
  page: number;
  limit: number;
  topicIds?: string[] | undefined;
}

export interface StoryDetailsParams {
  id: number;
}

export interface Story {
  id: number;
  abstract: string;
  title: string;
  cover: FileType;
  humanBook: User;
  rating: number;
  topics: Topic[];
  storyReview: StoryReview;
  isFavorited: boolean;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
}

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

export interface Histogram {
  rating: number;
  numberOfReviews: number;
}

export interface StoryReviewsOverview {
  rating: number;
  numberOfReviews: number;
  histogram: Histogram[];
  outstanding: StoryReview;
}
