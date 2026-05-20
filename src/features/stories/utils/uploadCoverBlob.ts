import type { useUploadMutation } from '@/libs/services/modules/files';

type UploadCoverMutation = ReturnType<typeof useUploadMutation>[0];

export async function uploadCoverBlob(
  blob: Blob,
  fileName: string,
  uploadCover: UploadCoverMutation,
): Promise<string | undefined> {
  const uploadResult = await uploadCover({
    fileName,
    fileSize: blob.size,
  });

  const signedUrl = uploadResult.data?.uploadSignedUrl;
  if (!signedUrl) {
    return undefined;
  }

  await fetch(signedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': blob.type || 'image/png' },
    body: blob,
  });

  return uploadResult.data?.file.id;
}
