import type { FileType } from '../files/fileType';
import type { StoryReview } from '../story-reviews/storyReviewsType';
import type { Topic } from '../topics/topicType';
import type { User } from '@/features/users/types';

export type SimilarStoriesParams = {
  page: number;
  limit: number;
  humanBookId?: string;
  topicIds?: string[] | number[];
};

export type StoriesParams = {
  humanBookId?: number;
  page: number;
  limit: number;
  topicIds?: string[];
  sortBy?: string;
};

export type SearchParams = {
  keyword: string;
};

export type StoryDetailsParams = {
  id: number;
};

export enum PublishStatusEnum {
  DRAFT = 1,
  PUBLISHED = 2,
  DELETED = 3,
  REJECTED = 4,
}

export enum StoryPublishStatus {
  DELETED = 'deleted',
  PUBLISHED = 'published',
  DRAFT = 'draft',
  REJECTED = 'rejected',
}

export type Story = {
  id: number;
  abstract: string;
  title: string;
  cover: FileType;
  humanBook: User;
  rating: number;
  topics: Topic[];
  storyReview: StoryReview;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
  isFavorite?: boolean;
  publishStatus: StoryPublishStatus;
  storyId?: number;
  highlightTitle?: string;
  highlightAbstract?: string;
};

type Histogram = {
  rating: number;
  numberOfReviews: number;
};

export type StoryReviewsOverview = {
  rating: number;
  numberOfReviews: number;
  histogram: Histogram[];
  outstanding: StoryReview;
};
