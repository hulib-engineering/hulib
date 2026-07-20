import type { Story } from './storiesType';
import { AppConfig } from '@/utils/AppConfig';

const SERVICE_KEY = 'hlb-93td6qrktpz6xrm4jj6dejgmffm4ya_pk';

export async function getStoryDetailServer(id: string): Promise<Story | null> {
  try {
    const res = await fetch(
      `${AppConfig.api.endpoint}/${AppConfig.api.version}/stories/${id}`,
      {
        headers: {
          'hulib-service-key': SERVICE_KEY,
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
