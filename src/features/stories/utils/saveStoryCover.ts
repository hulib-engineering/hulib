import { COVER_EXPORT_ELEMENT_ID } from '@/features/stories/constants';
import { rasterizeCoverElement } from '@/features/stories/utils/rasterizeCover';
import { uploadCoverBlob } from '@/features/stories/utils/uploadCoverBlob';
import type { useUploadMutation } from '@/libs/services/modules/files';

type UploadCoverMutation = ReturnType<typeof useUploadMutation>[0];

export async function saveStoryCoverFile(
  uploadCover: UploadCoverMutation,
  fileNameBase: string,
  elementId: string = COVER_EXPORT_ELEMENT_ID,
): Promise<string | undefined> {
  const blob = await rasterizeCoverElement(elementId);
  const fileName = `${fileNameBase}-${Date.now()}.png`;
  return uploadCoverBlob(blob, fileName, uploadCover);
}
