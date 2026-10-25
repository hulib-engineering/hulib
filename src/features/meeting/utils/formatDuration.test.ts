import { elapsedSecondsSince, formatDuration } from './formatDuration';

describe('formatDuration', () => {
  it('pads every segment to two digits', () => {
    expect(formatDuration(0)).toBe('00:00:00');
    expect(formatDuration(5)).toBe('00:00:05');
    expect(formatDuration(65)).toBe('00:01:05');
    expect(formatDuration(3600)).toBe('01:00:00');
    expect(formatDuration(3661)).toBe('01:01:01');
  });

  it('does not wrap hours at 24 for a long session', () => {
    expect(formatDuration(25 * 3600)).toBe('25:00:00');
  });

  it('floors fractional seconds', () => {
    expect(formatDuration(59.9)).toBe('00:00:59');
  });

  it('clamps non-finite and negative input to zero', () => {
    expect(formatDuration(-10)).toBe('00:00:00');
    expect(formatDuration(Number.NaN)).toBe('00:00:00');
    expect(formatDuration(Number.POSITIVE_INFINITY)).toBe('00:00:00');
  });
});

describe('elapsedSecondsSince', () => {
  it('returns whole seconds since the start timestamp', () => {
    const start = 1_700_000_000_000;

    expect(elapsedSecondsSince(start, start)).toBe(0);
    expect(elapsedSecondsSince(start, start + 1_000)).toBe(1);
    expect(elapsedSecondsSince(start, start + 90_500)).toBe(90);
  });

  it('never returns a negative value when the clock moves backwards', () => {
    const start = 1_700_000_000_000;

    expect(elapsedSecondsSince(start, start - 5_000)).toBe(0);
  });
});
