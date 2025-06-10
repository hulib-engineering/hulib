import type { FileType } from '../files/fileType';
import type { StoryReview } from '../story-reviews/storyReviewsType';
import type { Topic } from '../topics/topicType';
import type { User } from '../user/userType';

export interface SimilarStoriesParams {
  page: number;
  limit: number;
  humanBookId?: string;
  topicIds?: string[] | number[];
}

export interface StoriesParams {
  humanBookId?: number;
  page: number;
  limit: number;
  topicIds?: string[];
  sortBy?: string;
}

export interface SearchParams {
  keyword: string;
}

interface HumanBook {
  id: number;
  email: string;
  password: null | string;
  provider: string;
  socialId: string;
  fullName: string;
  birthday: null | string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null | string;
  genderId: null | number;
  roleId: number;
  statusId: number;
  approval: string;
  photoId: null | number;
  address: null | string;
  parentPhoneNumber: null | string;
  phoneNumber: null | string;
  bio: null | string;
  videoUrl: null | string;
  education: null | string;
  educationStart: null | string;
  educationEnd: null | string;
}

export interface SearchResult {
  id: number;
  title: string;
  abstract: string;
  coverId: null | number;
  createdAt: string;
  updatedAt: string;
  humanBook: HumanBook;
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
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
  isFavorite?: boolean;
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
