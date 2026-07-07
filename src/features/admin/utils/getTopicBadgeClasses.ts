type TopicColorToken =
  | 'primary'
  | 'blue'
  | 'lavender'
  | 'green'
  | 'yellow'
  | 'orange'
  | 'pink'
  | 'neutral';

/** Per-token badge classes from Figma (node 14883:9384). */
const TOPIC_BADGE_BY_TOKEN: Record<TopicColorToken, string> = {
  primary: 'bg-primary-90 border-primary-80 text-primary-60 hover:bg-primary-90 hover:text-primary-60',
  blue: 'bg-blue-90 border-blue-80 text-blue-60 hover:bg-blue-90 hover:text-blue-40',
  lavender: 'bg-lavender-90 border-lavender-80 text-lavender-40 hover:bg-lavender-90 hover:text-lavender-40',
  green: 'bg-green-90 border-green-80 text-green-40 hover:bg-green-90 hover:text-green-40',
  yellow: 'bg-yellow-90 border-yellow-80 text-orange-50 hover:bg-yellow-90 hover:text-orange-50',
  orange: 'bg-orange-90 border-orange-80 text-orange-50 hover:bg-orange-90 hover:text-orange-50',
  pink: 'bg-pink-90 border-pink-80 text-pink-40 hover:bg-pink-90 hover:text-pink-40',
  neutral: 'bg-neutral-98 border-neutral-90 text-neutral-30 hover:bg-neutral-98 hover:text-neutral-30',
};

const TOPIC_COLOR_TOKENS = new Set<string>(Object.keys(TOPIC_BADGE_BY_TOKEN));

const normalizeTopicColorToken = (color?: string): TopicColorToken => {
  if (!color?.trim()) {
    return 'neutral';
  }

  const base = color.trim().toLowerCase().split('-')[0] ?? 'neutral';

  if (TOPIC_COLOR_TOKENS.has(base)) {
    return base as TopicColorToken;
  }

  return 'neutral';
};

export const getTopicBadgeClasses = (
  color?: string,
): string => TOPIC_BADGE_BY_TOKEN[normalizeTopicColorToken(color)];
