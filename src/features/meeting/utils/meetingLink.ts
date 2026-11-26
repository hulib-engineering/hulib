/** Keep HuLib meeting links on the domain where the user is signed in. */
export function meetingLink(url: string): string {
  try {
    const parsed = new URL(url, 'https://local.invalid');
    const path = parsed.pathname.replace(/^\/(?:en|vi)(?=\/)/, '');
    if ((parsed.protocol === 'http:' || parsed.protocol === 'https:')
      && path === '/reading'
      && parsed.searchParams.has('channel')
      && parsed.searchParams.has('token')) {
      return `${path}${parsed.search}${parsed.hash}`;
    }
  } catch {
    // Preserve non-meeting links for existing callers.
  }
  return url;
}
