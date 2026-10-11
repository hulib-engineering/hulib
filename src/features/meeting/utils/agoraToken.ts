/**
 * Reads the Agora RTC token out of a query string.
 *
 * `+` in a query string decodes to a space, so the backend's token arrives
 * mangled and has to be repaired before `join()`. Dropping this repair breaks
 * every join in production, and fails silently, so it is kept here with a test.
 *
 * Pure and dependency-free so it can be unit tested without loading the Agora
 * SDK, which does not initialise under jsdom.
 */
export function readAgoraToken(search: string): string {
  const raw = new URLSearchParams(search).get('token') ?? '';
  return raw.replace(/ /g, '+');
}
