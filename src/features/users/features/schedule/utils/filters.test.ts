import type { MeetingCardModel } from '../types';
import { applyFilters, countByFilter, matchesFilter } from './filters';

const card = (variant: MeetingCardModel['variant']): MeetingCardModel => ({
  session: { id: String(variant) } as MeetingCardModel['session'],
  variant,
  counterpart: {} as MeetingCardModel['counterpart'],
  isViewerLiber: variant === 'my_request',
});

const CARDS = [
  card('right_now'),
  card('upcoming'),
  card('invitation'),
  card('my_request'),
  card('done'),
  card('missed'),
];

describe('matchesFilter', () => {
  it('admits every card under all', () => {
    expect(CARDS.every(item => matchesFilter(item, 'all'))).toBe(true);
  });

  it('maps each single-variant filter to exactly that variant', () => {
    expect(CARDS.filter(item => matchesFilter(item, 'right_now'))).toHaveLength(1);
    expect(CARDS.filter(item => matchesFilter(item, 'upcoming'))).toHaveLength(1);
    expect(CARDS.filter(item => matchesFilter(item, 'done'))).toHaveLength(1);
    expect(CARDS.filter(item => matchesFilter(item, 'missed'))).toHaveLength(1);
  });

  it('spans both request variants under requests', () => {
    const matched = CARDS.filter(item => matchesFilter(item, 'requests'));

    expect(matched.map(item => item.variant)).toEqual(['invitation', 'my_request']);
  });
});

describe('applyFilters', () => {
  it('returns everything when nothing is selected', () => {
    expect(applyFilters(CARDS, [])).toHaveLength(6);
    expect(applyFilters(CARDS, ['all'])).toHaveLength(6);
  });

  it('unions multiple selections', () => {
    expect(applyFilters(CARDS, ['done', 'missed']).map(item => item.variant)).toEqual(['done', 'missed']);
  });

  it('narrows to a single selection', () => {
    expect(applyFilters(CARDS, ['requests'])).toHaveLength(2);
  });

  it('ignores the catch-all when specific filters are also present', () => {
    expect(applyFilters(CARDS, ['all', 'done'])).toHaveLength(1);
  });
});

describe('countByFilter', () => {
  it('counts each filter bucket', () => {
    expect(countByFilter(CARDS)).toEqual({
      all: 6,
      right_now: 1,
      upcoming: 1,
      requests: 2,
      done: 1,
      missed: 1,
    });
  });

  it('returns zeroes for an empty list', () => {
    expect(countByFilter([])).toEqual({
      all: 0,
      right_now: 0,
      upcoming: 0,
      requests: 0,
      done: 0,
      missed: 0,
    });
  });
});
