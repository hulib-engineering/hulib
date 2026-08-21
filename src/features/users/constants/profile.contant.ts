import type { CardVariant } from '../types/profile';

export const HUBER_OWN_TABS = [
  { value: 'about', label: 'about' },
  { value: 'my_schedule', label: 'my_schedule' },
  { value: 'stories', label: 'my_stories' },
  { value: 'my_favorite', label: 'my_favorite' },
  { value: 'my_feedback', label: 'my_feedback' },
] as const;

export const LIBER_OWN_TABS = [
  { value: 'about', label: 'about' },
  { value: 'stories', label: 'my_stories' },
  { value: 'my_favorite', label: 'my_favorite' },
] as const;

export const LIBER_VIEWER_TABS = [
  { value: 'about', label: 'about' },
  { value: 'stories', label: 'my_stories' },
  { value: 'my_favorite', label: 'my_favorite' },
] as const;

export const HUBER_VIEWER_TABS = [
  { value: 'about', label: 'about' },
  { value: 'my_schedule', label: 'my_schedule' },
  { value: 'stories', label: 'my_stories' },
  { value: 'my_favorite', label: 'my_favorite' },
] as const;

export const VIEWER_TABS = LIBER_VIEWER_TABS;

export const CARD_CLASS: Record<CardVariant, string> = {
  right_now: 'border-4 border-primary-70 bg-white shadow-[0px_0px_8.8px_0px_rgba(8,_88,_250,_1)]',
  upcoming: 'border-4 border-primary-70 bg-white',
  invitation: 'border-2 border-orange-70 bg-white',
  my_request: 'border border-lavender-80 bg-lavender-98',
  done: 'bg-green-98',
  missed: 'bg-neutral-98',
};

export const BADGE_CLASS: Record<CardVariant, string> = {
  right_now: 'bg-primary-60 text-white',
  upcoming: 'bg-primary-60 text-white',
  invitation: 'bg-orange-50 text-white',
  my_request: 'bg-lavender-40 text-white',
  done: 'bg-green-50 text-white',
  missed: 'bg-red-60 text-white',
};
