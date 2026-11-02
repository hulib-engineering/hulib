import { getCountdown } from './countdown';

const NOW = new Date('2026-11-02T12:00:00.000Z');

const at = (offsetMinutes: number) =>
  new Date(NOW.getTime() + offsetMinutes * 60_000).toISOString();

describe('getCountdown', () => {
  it('marks a session between start and end as now', () => {
    expect(getCountdown(at(-5), at(25), NOW)).toEqual({
      state: 'now',
      totalMinutes: 0,
      hours: 0,
      minutes: 0,
    });
  });

  it('formats a session starting in 45 minutes', () => {
    expect(getCountdown(at(45), at(75), NOW)).toEqual({
      state: 'upcoming',
      totalMinutes: 45,
      hours: 0,
      minutes: 45,
    });
  });

  it('splits a 4h 5m gap into hours and minutes', () => {
    expect(getCountdown(at(245), at(275), NOW)).toEqual({
      state: 'upcoming',
      totalMinutes: 245,
      hours: 4,
      minutes: 5,
    });
  });

  it('keeps a whole hour as 1h 0m', () => {
    expect(getCountdown(at(60), at(90), NOW)).toEqual({
      state: 'upcoming',
      totalMinutes: 60,
      hours: 1,
      minutes: 0,
    });
  });

  it('clamps the final minute to 1m instead of 0m', () => {
    expect(getCountdown(at(0.5), at(30), NOW)).toEqual({
      state: 'upcoming',
      totalMinutes: 1,
      hours: 0,
      minutes: 1,
    });
  });

  it('marks a session whose end has passed as ended', () => {
    expect(getCountdown(at(-40), at(-10), NOW)).toEqual({
      state: 'ended',
      totalMinutes: 0,
      hours: 0,
      minutes: 0,
    });
  });

  it('treats a missing end as open-ended once started', () => {
    expect(getCountdown(at(-5), null, NOW)?.state).toBe('now');
  });

  it('returns null for an unusable start instant', () => {
    expect(getCountdown(null, at(30), NOW)).toBeNull();
    expect(getCountdown('not-a-date', at(30), NOW)).toBeNull();
  });
});
