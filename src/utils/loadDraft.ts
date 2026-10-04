import { useCallback, useEffect, useState } from 'react';
import { del, delMany, get, getMany, keys } from '@/libs/idbStore';

import type { Story } from '@/libs/services/modules/stories/storiesType';
import type { FileType } from '@/libs/services/modules/files/fileType';

// What saveDraft writes: same as draftStory, but the cover is a Blob instead of { path }.
export type StoredDraft = Omit<Story, 'cover'> & { coverBlob?: Blob };
const DRAFT_KEY_PREFIX = 'draft-';
export const draftKey = (id: number | string) => `${DRAFT_KEY_PREFIX}${id}`;

export async function getStoredDraft(id: number | string): Promise<StoredDraft | undefined> {
  return get<StoredDraft>(draftKey(id));
}

function toDraftStory(item: StoredDraft, urls: string[]): Story {
  const { coverBlob, ...rest } = item;
  const url = coverBlob ? URL.createObjectURL(coverBlob) : '';
  if (url) {
    urls.push(url);
  }
  return { ...rest, cover: { path: url } as FileType } as Story;
}

type UseDraftStories = {
  draftStories: Story[];
  isLoading: boolean;
};

export function useDraftStories(): UseDraftStories {
  const [draftStories, setDraftStories] = useState<Story[]>([]);
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
  draft: Story | undefined;
  isLoading: boolean;
};

export function useDraftStory(id?: number | string): UseDraftStory {
  const [draft, setDraft] = useState<Story>();
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

  return { draft, isLoading };
}

type UseDeleteDraft = {
  deleteDraft: (id: number | string) => Promise<boolean>;
  isLoading: boolean;
};

export function useDeleteDraft(): UseDeleteDraft {
  const [isLoading, setIsLoading] = useState(false);

  const deleteDraft = useCallback(async (id: number | string) => {
    console.log(id);
    setIsLoading(true);
    try {
      await del(draftKey(id));
      return true;
    } catch (err) {
      console.error('Draft delete failed', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { deleteDraft, isLoading };
}

type UseDeleteAllDrafts = {
  deleteAllDrafts: () => Promise<boolean>;
  isLoading: boolean;
};

export function useDeleteAllDrafts(): UseDeleteAllDrafts {
  const [isLoading, setIsLoading] = useState(false);

  const deleteAllDrafts = useCallback(async () => {
    setIsLoading(true);
    try {
      const draftKeys = (await keys()).filter(
        (k): k is string => typeof k === 'string' && k.startsWith(DRAFT_KEY_PREFIX),
      );
      await delMany(draftKeys);
      return true;
    } catch (err) {
      console.error('Draft delete failed', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { deleteAllDrafts, isLoading };
}
