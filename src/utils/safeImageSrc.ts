const GLUED_URL = /^https?:\/\/[^/?#]*?(https?:\/\/.+)$/;

const isValidUrl = (value: string): boolean => {
  try {
    return Boolean(new URL(value));
  } catch {
    return false;
  }
};

export const safeImageSrc = (path?: string | null): string | null => {
  if (!path) {
    return null;
  }

  // "http://localhost:3001https://x" -> "https://x"
  const candidate = path.match(GLUED_URL)?.[1] ?? path;

  if (candidate.startsWith('/')) {
    return candidate;
  } // local path
  return isValidUrl(candidate) ? candidate : null;
};
