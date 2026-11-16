import Image from 'next/image';

export function StickerImage({ src, alt }: { src?: string; alt: string }) {
  if (!src || !/^(?:\/(?!\/)|https?:\/\/)/i.test(src)) {
    return <span className="p-2 text-sm text-neutral-30">{alt}</span>;
  }

  return <Image alt={alt} src={src} width={120} height={120} className="size-[120px] object-contain" />;
}
