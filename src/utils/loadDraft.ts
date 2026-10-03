import { useEffect, useState } from 'react';
import { get, getMany, keys } from 'idb-keyval';

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

const DRAFT_KEY_PREFIX = 'draft-';

export const draftKey = (id: number | string) => `${DRAFT_KEY_PREFIX}${id}`;

// Raw record (with Blob). Usable outside React, e.g. in handlers.
export async function getStoredDraft(id: number | string): Promise<StoredDraft | undefined> {
  return get<StoredDraft>(draftKey(id));
}

function toDraftStory(item: StoredDraft, urls: string[]): draftStory {
  const { coverBlob, ...rest } = item;
  const url = coverBlob ? URL.createObjectURL(coverBlob) : '';
  if (url) {
    urls.push(url);
  }
  return { ...rest, cover: { path: url } as FileType } as draftStory;
}

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

    (async () => {
      const draftKeys = (await keys()).filter(
        (k): k is string => typeof k === 'string' && k.startsWith(DRAFT_KEY_PREFIX),
      );
      const stored = await getMany<StoredDraft>(draftKeys);
      if (cancelled) {
        return;
      }
      setDraftStories(
        stored
          .filter((item): item is StoredDraft => item !== undefined)
          .map(item => toDraftStory(item, urls)),
      );
    })()
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

type UseDraftStory = {
  draftStory: draftStory | undefined;
  isLoading: boolean;
};

export function useDraftStory(id?: number | string): UseDraftStory {
  const [draft, setDraft] = useState<draftStory>();
  const [isLoading, setIsLoading] = useState(id !== undefined);

  useEffect(() => {
    if (id === undefined) {
      setDraft(undefined);
      setIsLoading(false);
      return undefined;
    }

    let cancelled = false;
    const urls: string[] = [];
    setIsLoading(true);

    getStoredDraft(id)
      .then((stored) => {
        if (cancelled) {
          return;
        }
        setDraft(stored ? toDraftStory(stored, urls) : undefined);
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
  }, [id]);

  return { draftStory: draft, isLoading };
}
