import type { FileType } from '../files/fileType';
import type { User } from '../user/userType';

export interface StoriesParams {
  page: number;
  limit: number;
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
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
}

export interface StoryReview {
  id: number;
  rating: number;
  title: string;
  comment: string;
  user: User;
  createdAt?: string;
  updatedAt?: string;
}
