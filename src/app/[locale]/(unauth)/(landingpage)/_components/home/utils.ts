export const truncateMiddleText = (value: string, maxLength: number) => {
  if (value.length <= maxLength || maxLength < 5) {
    return value;
  }

  const visibleChars = maxLength - 3;
  const startLength = Math.ceil(visibleChars / 2);
  const endLength = Math.floor(visibleChars / 2);

  return `${value.slice(0, startLength)}...${value.slice(-endLength)}`;
};

/** Legacy clipboard copy via execCommand — used as a fallback when the Clipboard API is unavailable. */
export const fallbackCopyText = (value: string) => {
  const textArea = document.createElement('textarea');
  textArea.value = value;
  textArea.setAttribute('readonly', '');
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  const isCopied = document.execCommand('copy');
  document.body.removeChild(textArea);

  return isCopied;
};

/**
 * Copies `text` to the clipboard.
 * Prefers the async Clipboard API; silently falls back to execCommand for
 * insecure contexts or browsers that don't support the modern API.
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  // Modern path: async Clipboard API (requires HTTPS / secure context)
  if (window.isSecureContext && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to legacy method below
    }
  }

  // Legacy path: synchronous execCommand fallback
  return fallbackCopyText(text);
};
