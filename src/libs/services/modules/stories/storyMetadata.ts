import type { Story } from './storiesType';
import { Env } from '@/libs/Env.mjs';
import { AppConfig } from '@/utils/AppConfig';

export async function getStoryDetailServer(id: string): Promise<Story | null> {
  try {
    const res = await fetch(
      `${AppConfig.api.endpoint}/${AppConfig.api.version}/stories/${id}`,
      {
        headers: {
          'hulib-service-key': Env.NEXT_PUBLIC_HULIB_SERVICE_KEY,
        },
        cache: 'no-store',
      },
    );

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch {
    return null;
  }
}

export function resolveCoverUrl(raw?: string | null): string {
  if (!raw) {
    return '';
  }
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    return raw;
  }
  const apiBase = AppConfig.api.endpoint.replace(/\/api\/?$/, '');
  return `${apiBase}${raw.startsWith('/') ? '' : '/'}${raw}`;
}
