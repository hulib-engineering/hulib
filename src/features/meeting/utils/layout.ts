import type { MeetingLayoutMode } from '../types';

/** Tailwind `xl` — the breakpoint the meeting room treats as its desktop floor. */
export const MEETING_RAIL_BREAKPOINT = 1280;

/**
 * Derives the stage arrangement.
 *
 * Sharing a screen always collapses participants into the rail, regardless of
 * viewport: on narrow viewports the shell renders the rail as a strip rather than
 * dropping the shared screen, so the mode stays a pure function of one flag.
 */
export function resolveLayoutMode(isSharingScreen: boolean): MeetingLayoutMode {
  return isSharingScreen ? 'rail' : 'spotlight';
}

/**
 * True when the viewport is wide enough for the side rail.
 * Below `xl` the shell falls back to the pre-existing stacked layout.
 */
export function isRailViewport(viewportWidth: number): boolean {
  return viewportWidth >= MEETING_RAIL_BREAKPOINT;
}