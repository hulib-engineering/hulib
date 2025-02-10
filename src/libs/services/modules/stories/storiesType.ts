import type { FileType } from '../files/fileType';
import type { StoryReview } from '../story-reviews/storyReviewsType';
import type { Topic } from '../topics/topicType';
import type { User } from '../user/userType';

export interface SimilarStoriesParams {
  page: number;
  limit: number;
  humanBookId?: string;
  topicIds?: string[];
}

export interface StoriesParams {
  page: number;
  limit: number;
  topicIds?: string[];
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
