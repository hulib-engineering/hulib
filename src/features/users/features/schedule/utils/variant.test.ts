import { getTimeLeft, isViewerHuber, resolveVariant } from './variant';

const NOW = new Date('2026-02-18T08:00:00.000Z');

const base = {
  humanBookId: 7,
  readerId: 9,
  startedAt: '2026-02-18T09:00:00.000Z',
  endedAt: '2026-02-18T09:30:00.000Z',
};

describe('resolveVariant', () => {
  it('maps an approved session happening right now to right_now', () => {
    expect(resolveVariant({ ...base, sessionStatus: 'approved' }, 9, new Date('2026-02-18T09:15:00.000Z'))).toBe('right_now');
  });

  it('maps an approved session in the future to upcoming', () => {
    const future = { ...base, startedAt: '2026-02-18T10:00:00.000Z', endedAt: '2026-02-18T10:30:00.000Z' };

    expect(resolveVariant({ ...future, sessionStatus: 'approved' }, 9, NOW)).toBe('upcoming');
  });

  it('treats the exact start instant as right_now and the exact end instant as not', () => {
    expect(resolveVariant({ ...base, sessionStatus: 'approved' }, 9, new Date('2026-02-18T09:00:00.000Z'))).toBe('right_now');
    expect(resolveVariant({ ...base, sessionStatus: 'approved' }, 9, new Date('2026-02-18T09:30:00.000Z'))).toBe('upcoming');
  });

  it('falls back to upcoming when the time window is missing or unparseable', () => {
    expect(resolveVariant({ ...base, startedAt: null, endedAt: null, sessionStatus: 'approved' }, 9, NOW)).toBe('upcoming');
    expect(resolveVariant({ ...base, startedAt: 'not-a-date', sessionStatus: 'approved' }, 9, NOW)).toBe('upcoming');
  });

  it('maps a pending session to invitation when the viewer is the Huber', () => {
    expect(resolveVariant({ ...base, sessionStatus: 'pending' }, 7, NOW)).toBe('invitation');
  });

  it('maps a pending session to my_request when the viewer is the Liber', () => {
    expect(resolveVariant({ ...base, sessionStatus: 'pending' }, 9, NOW)).toBe('my_request');
  });

  it('compares ids numerically, since the wire types them as numbers', () => {
    expect(resolveVariant({ ...base, humanBookId: '7', sessionStatus: 'pending' }, '7', NOW)).toBe('invitation');
  });

  it('maps finished to done and missed to missed', () => {
    expect(resolveVariant({ ...base, sessionStatus: 'finished' }, 9, NOW)).toBe('done');
    expect(resolveVariant({ ...base, sessionStatus: 'missed' }, 9, NOW)).toBe('missed');
  });

  it('accepts the casing the backend actually sends', () => {
    expect(resolveVariant({ ...base, sessionStatus: 'Pending' }, 7, NOW)).toBe('invitation');
    expect(resolveVariant({ ...base, sessionStatus: 'FINISHED' }, 9, NOW)).toBe('done');
  });

  it('returns null for statuses the grid does not render', () => {
    expect(resolveVariant({ ...base, sessionStatus: 'canceled' }, 9, NOW)).toBeNull();
    expect(resolveVariant({ ...base, sessionStatus: 'rejected' }, 9, NOW)).toBeNull();
    expect(resolveVariant({ ...base, sessionStatus: 'unInitialized' }, 9, NOW)).toBeNull();
    expect(resolveVariant({ ...base, sessionStatus: undefined }, 9, NOW)).toBeNull();
  });

  it('returns null rather than throwing when there is no viewer yet', () => {
    expect(resolveVariant({ ...base, sessionStatus: 'pending' }, undefined, NOW)).toBe('my_request');
    expect(isViewerHuber({ ...base, sessionStatus: 'pending' }, undefined)).toBe(false);
  });
});

describe('getTimeLeft', () => {
  it('breaks the remaining time into whole days and hours', () => {
    expect(getTimeLeft('2026-02-22T15:00:00.000Z', NOW)).toEqual({ days: 4, hours: 7 });
  });

  it('reports zero for a session that already started', () => {
    expect(getTimeLeft('2026-02-18T07:00:00.000Z', NOW)).toEqual({ days: 0, hours: 0 });
  });

  it('reports zero for a missing or unparseable start instead of NaN', () => {
    expect(getTimeLeft(null, NOW)).toEqual({ days: 0, hours: 0 });
    expect(getTimeLeft('nonsense', NOW)).toEqual({ days: 0, hours: 0 });
  });
});
