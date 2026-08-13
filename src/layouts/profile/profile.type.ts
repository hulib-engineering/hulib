import type { User } from '@/features/users/types';
import type { Story } from '@/libs/services/modules/stories/storiesType';

export type TUserDetail = User & { firstStory: Story; huberSince?: string; createdAt?: string };
