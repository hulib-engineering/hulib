import type { Metadata } from 'next';

import { AppConfig } from '@/utils/AppConfig';

type StoryDetailLayoutParams = {
  params: { id: string; locale: string };
};

async function getStoryDetail(id: string) {
  try {
    const res = await fetch(
      `${AppConfig.api.endpoint}/${AppConfig.api.version}/stories/${id}`,
      {
        headers: {
          'hulib-service-key': 'hlb-93td6qrktpz6xrm4jj6dejgmffm4ya_pk',
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

function resolveCoverUrl(raw?: string | null): string {
  if (!raw) {
    return '';
  }
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    return raw;
  }
  const apiBase = AppConfig.api.endpoint.replace(/\/api\/?$/, '');
  return `${apiBase}${raw.startsWith('/') ? '' : '/'}${raw}`;
}

export async function generateMetadata({ params }: StoryDetailLayoutParams): Promise<Metadata> {
  const story = await getStoryDetail(params.id);

  if (!story) {
    return {};
  }

  const coverUrl = resolveCoverUrl(story?.cover?.path);
  const title = story?.title || 'HuLib Story';
  const description = story?.abstract || '';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: coverUrl ? [{ url: coverUrl, width: 1200, height: 630 }] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: coverUrl ? [coverUrl] : [],
    },
  };
}

export default function StoryDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
