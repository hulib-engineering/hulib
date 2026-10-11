import { isRailViewport, resolveLayoutMode } from './layout';
import { MEETING_RAIL_BREAKPOINT } from './layout';

describe('resolveLayoutMode', () => {
  it('uses spotlight when nothing is being shared', () => {
    expect(resolveLayoutMode(false)).toBe('spotlight');
  });

  it('switches to the rail as soon as a screen share starts', () => {
    expect(resolveLayoutMode(true)).toBe('rail');
  });
});

describe('isRailViewport', () => {
  it('treats xl and above as rail-capable', () => {
    expect(isRailViewport(MEETING_RAIL_BREAKPOINT)).toBe(true);
    expect(isRailViewport(1920)).toBe(true);
  });

  it('falls back below xl so mobile keeps the stacked layout', () => {
    expect(isRailViewport(1279)).toBe(false);
    expect(isRailViewport(390)).toBe(false);
  });
});