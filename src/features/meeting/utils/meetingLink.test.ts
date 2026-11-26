import { meetingLink } from './meetingLink';

describe('meetingLink', () => {
  it('keeps a meeting on the current domain without changing its token', () => {
    expect(meetingLink('https://old.example/en/reading?channel=session-1&token=a+b%2Bc&expireAt=123'))
      .toBe('/reading?channel=session-1&token=a+b%2Bc&expireAt=123');
  });

  it('leaves other links unchanged', () => {
    expect(meetingLink('https://meet.example/other?token=abc')).toBe('https://meet.example/other?token=abc');
    expect(meetingLink('https://meet.example/reading')).toBe('https://meet.example/reading');
  });
});
