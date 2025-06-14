export function paginateText(
  longText: string,
  containerWidth: number,
  containerHeight: number,
  _numberOfPageDisplayed: number,
  lineHeight: number,
  charMaxWidth?: number,
) {
  if (!longText || longText.length === 0) return [];
  if (containerWidth <= 0 || containerHeight <= 0) return [];

  const pages = [];
  const charWidth = Math.floor(charMaxWidth ?? containerWidth);

  const charsPerLine = Math.max(Math.floor(containerWidth / charWidth), 10);
  const linesPerPage = Math.max(Math.floor(containerHeight / lineHeight), 3);
  const maxCharsPerPage = Math.max(
    Math.floor(charsPerLine * linesPerPage),
    100,
  );

  let currentIndex = 0;

  let iterationCount = 0;
  const maxIterations = Math.ceil(longText.length / 50);

  while (currentIndex < longText.length && iterationCount < maxIterations) {
    iterationCount += 1;

    const remainingText = longText.slice(currentIndex);
    if (remainingText.length === 0) break;

    const maxChars = Math.min(maxCharsPerPage, remainingText.length);
    const pageText = remainingText.slice(0, maxChars);
    let finalText = pageText;

    // Ensure not to split words
    if (maxChars < remainingText.length) {
      const lastSpaceIndex = pageText.lastIndexOf(' ');
      if (lastSpaceIndex > 0) {
        finalText = pageText.slice(0, lastSpaceIndex);
      }
    }

    const trimmedText = finalText.trim();
    if (trimmedText.length > 0) {
      pages.push(trimmedText);
      currentIndex += finalText.length;

      // Skip whitespace
      while (currentIndex < longText.length && longText[currentIndex] === ' ') {
        currentIndex += 1;
      }
    } else {
      break;
    }
  }

  return pages;
}
