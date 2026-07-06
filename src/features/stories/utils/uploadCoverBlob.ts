import type { useUploadMutation } from '@/libs/services/modules/files';

type UploadCoverMutation = ReturnType<typeof useUploadMutation>[0];

export async function uploadCoverBlob(
  blob: Blob,
  fileName: string,
  uploadCover: UploadCoverMutation,
): Promise<string | undefined> {
  const file = new File([blob], fileName, { type: blob.type || 'image/png' });

  const uploadResult = await uploadCover(file);

  return uploadResult.data?.file?.id; // khớp đúng shape { file: { id, path } }
}
