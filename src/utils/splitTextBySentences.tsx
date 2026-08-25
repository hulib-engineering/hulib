/**
 * Split text into sentences based on Vietnamese and English punctuation.
 * Handles: . ! ? followed by space or end of string.
 * Returns array of sentence strings (including their trailing punctuation).
 */
export function splitTextIntoSentences(
  text: string,
): string[] {
  if (!text) {
    return [];
  }

  // Split on sentence terminators followed by whitespace or end-of-string.
  // - ASCII ".!?" split on: trailing space/end (e.g. "end. Next") OR a following
  //   uppercase letter (casual typing without space: "mỏi.Mình") — avoids
  //   breaking decimals ("3.14") thanks to the uppercase requirement.
  // - CJK "。！？" are unambiguous terminators and need no trailing space
  // - Newlines are paragraph boundaries, valid break points even when the
  //   preceding fragment lacks punctuation
  const parts = text.split(
    /([.!?]+(?:\s|$)|[.!?](?=\p{Lu})|[。！？]|\n+)/u,
  );

  const sentences: string[] = [];
  for (let i = 0; i < parts.length; i += 2) {
    const sentence = parts[i] || '';
    const delimiter = parts[i + 1] || '';
    // Re-attach the punctuation/delimiter to the sentence
    sentences.push(sentence + delimiter);
  }

  // Filter out empty strings and trim each sentence
  return sentences
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

export type TextBox = {
  /** Available content width in pixels */
  width: number;
  /** Available content height in pixels */
  height: number;
};

export type TextStyleOptions = {
  fontSize: number;
  fontFamily: string;
  fontWeight?: string | number;
  fontStyle?: string;
  /** Line height in pixels */
  lineHeightPx: number;
  /** Letter spacing in pixels */
  letterSpacingPx?: number;
  /** Simulate `break-all` wrapping (chars can break mid-word) */
  breakAll?: boolean;
};

export type TextMeasurer = (text: string) => number;

/**
 * Creates a canvas-based text width measurer (browser only).
 * Letter spacing is approximated as spacing × (length − 1).
 */
export function createCanvasTextMeasurer(style: TextStyleOptions): TextMeasurer {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return () => 0;
  }

  const weight = style.fontWeight ?? 'normal';
  const fontStyle = style.fontStyle ?? 'normal';
  ctx.font = `${fontStyle} ${weight} ${style.fontSize}px ${style.fontFamily}`;

  const letterSpacing = style.letterSpacingPx ?? 0;

  return (text: string) => {
    return ctx.measureText(text).width + letterSpacing * Math.max(text.length - 1, 0);
  };
}

/** Count wrapped lines assuming `break-all` style char-level wrapping. */
function countLinesBreakAll(
  text: string,
  maxWidth: number,
  measure: TextMeasurer,
): number {
  let lines = 1;
  let lineWidth = 0;

  for (const char of Array.from(text)) {
    const charWidth = measure(char);
    if (lineWidth === 0 || lineWidth + charWidth <= maxWidth) {
      lineWidth += charWidth;
    } else {
      lines += 1;
      lineWidth = charWidth;
    }
  }

  return lines;
}

/** Count wrapped lines assuming normal word-based wrapping. */
function countLinesNormal(
  text: string,
  maxWidth: number,
  measure: TextMeasurer,
): number {
  const words = text.split(/\s+/).filter(Boolean);
  let lines = 1;
  let currentLine = '';

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    if (measure(candidate) <= maxWidth) {
      currentLine = candidate;
    } else if (currentLine === '') {
      // Single word longer than a whole line
      lines += 1;
    } else {
      lines += 1;
      currentLine = word;
    }
  }

  return lines;
}

function countWrappedLines(
  text: string,
  maxWidth: number,
  style: TextStyleOptions,
  measure: TextMeasurer,
): number {
  if (!text) {
    return 0;
  }
  return style.breakAll
    ? countLinesBreakAll(text, maxWidth, measure)
    : countLinesNormal(text, maxWidth, measure);
}

export type SplitAbstractBySizeOptions = {
  abstract: string;
  leftBox: TextBox;
  rightBox: TextBox;
  textStyle: TextStyleOptions;
  /**
   * Injectable measurer for tests; defaults to a canvas-based one.
   */
  measure?: TextMeasurer;
};

export type SplitPagesResult = {
  leftPageContent: string;
  rightPageContent: string;
  /** True when the abstract does not fully fit both pages */
  truncated: boolean;
};

/**
 * Distribute abstract sentences across the two pages based on the real
 * pixel capacity (max width & height) of each page's text box.
 *
 * - The left page greedily packs as many WHOLE sentences as fit.
 * - The right page continues seamlessly from where the left page stops.
 * - The left page is never truncated with "...".
 * - The right page appends "..." only when leftover sentences remain.
 */
export function splitAbstractForPages(
  options: SplitAbstractBySizeOptions,
): SplitPagesResult {
  const { abstract, leftBox, rightBox, textStyle } = options;
  const measure = options.measure ?? createCanvasTextMeasurer(textStyle);

  const sentences = splitTextIntoSentences(abstract);
  if (sentences.length === 0) {
    return { leftPageContent: '', rightPageContent: '', truncated: false };
  }

  const maxLinesLeft = Math.max(Math.floor(leftBox.height / textStyle.lineHeightPx), 1);
  const maxLinesRight = Math.max(Math.floor(rightBox.height / textStyle.lineHeightPx), 1);

  // --- Fill the left page (never truncated) ---
  let leftSentenceCount = 0;
  while (leftSentenceCount < sentences.length) {
    const candidate = sentences.slice(0, leftSentenceCount + 1).join(' ');
    const lines = countWrappedLines(candidate, leftBox.width, textStyle, measure);
    if (lines > maxLinesLeft) {
      break;
    }
    leftSentenceCount++;
  }
  // Always show at least one sentence; overflow-hidden clips the rest visually
  leftSentenceCount = Math.max(leftSentenceCount, 1);

  const leftPageContent = sentences.slice(0, leftSentenceCount).join(' ');

  // --- Fill the right page (continues seamlessly from the left) ---
  const remainingSentences = sentences.slice(leftSentenceCount);
  let rightSentenceCount = 0;
  while (rightSentenceCount < remainingSentences.length) {
    const candidate = remainingSentences.slice(0, rightSentenceCount + 1).join(' ');
    const lines = countWrappedLines(candidate, rightBox.width, textStyle, measure);
    if (lines > maxLinesRight) {
      break;
    }
    rightSentenceCount++;
  }

  const truncated = rightSentenceCount < remainingSentences.length;
  let rightPageContent = remainingSentences.slice(0, rightSentenceCount).join(' ');
  if (truncated) {
    // Always show something when there is leftover content
    if (rightSentenceCount === 0) {
      rightPageContent = `${remainingSentences[0]}...`;
    } else {
      rightPageContent = `${rightPageContent}...`;
    }
  }

  return { leftPageContent, rightPageContent, truncated };
}
