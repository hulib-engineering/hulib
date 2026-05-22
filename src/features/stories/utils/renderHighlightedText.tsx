import React from 'react';

/** Renders text with `<b>...</b>` segments highlighted (e.g. search match snippets). */
export function renderHighlightedText(
  text: string,
  highlightClass = 'bg-green-70/50',
) {
  if (!text) {
    return null;
  }

  const parts = text.split(/(<b>|<\/b>)/g);

  let isBold = false;
  return parts.map((part, index) => {
    if (part === '<b>') {
      isBold = true;
      return null;
    }
    if (part === '</b>') {
      isBold = false;
      return null;
    }
    if (isBold) {
      return (
        <span key={index} className={highlightClass}>
          {part}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
}
