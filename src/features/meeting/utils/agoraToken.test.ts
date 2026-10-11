import { readAgoraToken } from './agoraToken';

describe('readAgoraToken', () => {
  it('repairs "+" that the query string decoded into spaces', () => {
    // The backend hands out a token containing "+" characters. In a query string
    // "+" decodes to a space, so join() needs the spaces put back. Removing this
    // repair breaks every join and fails silently.
    expect(readAgoraToken('?channel=session-1&token=abc+def+ghi')).toBe('abc+def+ghi');
  });

  it('returns an empty string when no token is present', () => {
    expect(readAgoraToken('?channel=session-1')).toBe('');
    expect(readAgoraToken('')).toBe('');
  });

  it('leaves a token that has no "+" untouched', () => {
    expect(readAgoraToken('?token=abcdef')).toBe('abcdef');
  });
});
