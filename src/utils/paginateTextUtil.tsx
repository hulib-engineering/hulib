import type { RefObject } from 'react';

export const paginateText = (
  longText: string,
  containerWidth: number,
  containerHeight: number,
  actualContainerRef: RefObject<HTMLDivElement>,
  isFixedSize?: boolean,
) => {
  if (!actualContainerRef.current) {
    return [];
  }

  const realStyles = window.getComputedStyle(actualContainerRef.current);
  const pagePadding = {
    left: Number.parseFloat(realStyles.getPropertyValue('--page-padding-left')) || 32,
    right: Number.parseFloat(realStyles.getPropertyValue('--page-padding-right')) || 24,
    top: 32,
    bottom: 0,
  };

  // Calculate real available space
  const availableWidth = isFixedSize ? containerWidth : containerWidth - pagePadding.left - pagePadding.right;
  const availableHeight = isFixedSize ? containerHeight : containerHeight - pagePadding.top - pagePadding.bottom - 68;

  const styleKeys = [
    'fontFamily',
    'fontSize',
    'lineHeight',
    'letterSpacing',
    'whiteSpace',
    'wordBreak',
    'overflowWrap',
    'padding',
    'margin',
  ];

  // Set up a virtual container to measure text
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.visibility = 'hidden';
  container.style.width = `${availableWidth}px`;
  container.style.maxHeight = `${availableHeight}px`;

  // Force typography identical to your book pages
  styleKeys.forEach((key) => {
    (container.style as any)[key]
      = realStyles[key as keyof CSSStyleDeclaration];
  });

  document.body.appendChild(container);

  const words = longText.split(/(\s+)/);
  const pages: { content: string }[] = [];
  let currentPage: string[] = [];

  for (let i = 0; i < words.length; i++) {
    currentPage.push(words[i] ?? '');
    container.textContent = currentPage.join('');

    if (container.scrollHeight > availableHeight) {
      currentPage.pop();
      pages.push({ content: currentPage.join('') });
      currentPage = [words[i] ?? ''];
      container.textContent = currentPage.join('');
    }
  }

  if (currentPage.length > 0) {
    pages.push({ content: currentPage.join('') });
  }

  document.body.removeChild(container);
  return pages;
};
