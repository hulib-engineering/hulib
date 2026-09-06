import { cache } from 'react';

import { Env } from '@/libs/Env.mjs';
import { AppConfig } from '@/utils/AppConfig';
import type { Story } from '@/libs/services/modules/stories/storiesType';

const BASE_URL = `${AppConfig.api.endpoint}/${AppConfig.api.version}`;

export const fetchStoryDetail = cache(async (id: number): Promise<Story | null> => {
  try {
    const res = await fetch(`${BASE_URL}/stories/${id}`, {
      headers: { 'hulib-service-key': Env.NEXT_PUBLIC_HULIB_SERVICE_KEY },
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      return null;
    }
    return res.json();
  } catch {
    return null;
  }
});
