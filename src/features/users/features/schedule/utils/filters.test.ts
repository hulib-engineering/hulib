import { filterToStatuses } from './filters';

describe('filterToStatuses', () => {
  it('sends nothing for all, so the backend applies its own default set', () => {
    expect(filterToStatuses(['all'])).toEqual([]);
    expect(filterToStatuses([])).toEqual([]);
  });

  it('maps each filter onto its single status', () => {
    expect(filterToStatuses(['approved'])).toEqual(['approved']);
    expect(filterToStatuses(['pending'])).toEqual(['pending']);
    expect(filterToStatuses(['finished'])).toEqual(['finished']);
    expect(filterToStatuses(['missed'])).toEqual(['missed']);
  });

  it('unions a multi-select', () => {
    expect(filterToStatuses(['approved', 'missed'])).toEqual(['approved', 'missed']);
  });

  it('de-duplicates repeated selections', () => {
    expect(filterToStatuses(['approved', 'approved'])).toEqual(['approved']);
  });

  it('ignores all when specific filters are also selected', () => {
    expect(filterToStatuses(['all', 'finished'])).toEqual(['finished']);
  });
});
