// @/utils
import { useEffect, useState } from 'react';
import { get } from 'idb-keyval';

import type { Story as TStory } from '@/libs/services/modules/stories/storiesType';
import type { FileType } from '@/libs/services/modules/files/fileType';

export type draftStory = Pick<
  TStory,
  | 'id'
  | 'title'
  | 'abstract'
  | 'cover'
  | 'humanBook'
  | 'publishStatus'
  | 'topics'
  | 'rejectionReason'
  | 'likeCount'
  | 'viewCount'
  | 'shareCount'
  | 'highlightTitle'
  | 'highlightAbstract'
>;

// What saveDraft writes: same as draftStory, but the cover is a Blob instead of { path }.
export type StoredDraft = Omit<draftStory, 'cover'> & { coverBlob?: Blob };

type UseDraftStories = {
  draftStories: draftStory[];
  isLoading: boolean;
};

export function useDraftStories(): UseDraftStories {
  const [draftStories, setDraftStories] = useState<draftStory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const urls: string[] = [];

    get<StoredDraft[]>('draft')
      .then((stored) => {
        if (!stored || cancelled) {
          return;
        }
        setDraftStories(
          stored.map((item): draftStory => {
            const { coverBlob, ...rest } = item;
            const url = coverBlob ? URL.createObjectURL(coverBlob) : '';
            if (url) {
              urls.push(url);
            }
            return { ...rest, cover: { path: url } as FileType } as draftStory;
          }),
        );
      })
      .catch(err => console.error('Draft load failed', err))
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  return { draftStories, isLoading };
}
