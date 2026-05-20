import { toPng } from 'html-to-image';

const IMAGE_LOAD_TIMEOUT_MS = 10_000;

function waitForImage(img: HTMLImageElement): Promise<void> {
  if (img.complete && img.naturalHeight > 0) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      reject(new Error(`Timed out loading cover image: ${img.src}`));
    }, IMAGE_LOAD_TIMEOUT_MS);

    const done = () => {
      window.clearTimeout(timeoutId);
      resolve();
    };

    img.addEventListener('load', done, { once: true });
    img.addEventListener('error', () => {
      window.clearTimeout(timeoutId);
      reject(new Error(`Failed to load cover image: ${img.src}`));
    }, { once: true });
  });
}

async function waitForImages(node: HTMLElement) {
  const images = Array.from(node.querySelectorAll('img'));
  if (images.length === 0) {
    return;
  }

  await Promise.all(images.map(img => waitForImage(img)));
}

async function waitForFonts() {
  if (typeof document === 'undefined' || !document.fonts?.ready) {
    return;
  }

  await document.fonts.ready;
}

export async function rasterizeCoverElement(
  elementId: string,
): Promise<Blob> {
  const node = document.getElementById(elementId);
  if (!node) {
    throw new Error('Cover preview element not found');
  }

  await waitForFonts();
  await waitForImages(node);
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });

  const dataUrl = await toPng(node, {
    cacheBust: true,
    pixelRatio: 2,
  });

  const response = await fetch(dataUrl);
  return response.blob();
}
