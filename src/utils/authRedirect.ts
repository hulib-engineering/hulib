import Cookies from 'js-cookie';

export const POST_LOGIN_REDIRECT_COOKIE = 'post_login_redirect';

const TECHNICAL_REDIRECT_PATHS = ['/api', '/monitoring', '/_next', '/_vercel'];

const isSafeRedirectPath = (path: string) =>
  path.startsWith('/')
  && !path.startsWith('//')
  && !TECHNICAL_REDIRECT_PATHS.some(route => path === route || path.startsWith(`${route}/`) || path.startsWith(`${route}?`));

export function setPostLoginRedirect(path: string) {
  if (!isSafeRedirectPath(path)) {
    return;
  }
  Cookies.set(POST_LOGIN_REDIRECT_COOKIE, path, { expires: 1 / 144 });
}

export function consumePostLoginRedirect(fallback: string): string {
  const value = Cookies.get(POST_LOGIN_REDIRECT_COOKIE);
  Cookies.remove(POST_LOGIN_REDIRECT_COOKIE);

  return value && isSafeRedirectPath(value) ? value : fallback;
}
