import type { Metadata } from 'next';

import { getStoryDetailServer, resolveCoverUrl } from '@/libs/services/modules/stories/storyMetadata';

type StoryDetailLayoutParams = {
  params: { id: string; locale: string };
};

export async function generateMetadata({ params }: StoryDetailLayoutParams): Promise<Metadata> {
  const story = await getStoryDetailServer(params.id);

  if (!story) {
    return {};
  }

  const coverUrl = resolveCoverUrl(story.cover?.path);
  const title = story.title || 'HuLib Story';
  const description = story.abstract || '';

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
