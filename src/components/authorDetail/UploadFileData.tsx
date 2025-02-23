import { Trash } from '@phosphor-icons/react';
import Image from 'next/image';
import * as React from 'react';

type Props = {
  uploadSelectedFile: (file: File | undefined) => void;
};
export const UploadFileData = ({ uploadSelectedFile }: Props) => {
  const [selectedImage, setSelectedImage] = React.useState<string>();
  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    setSelectedImage(file ? URL.createObjectURL(file) : undefined);
    uploadSelectedFile(file);
  };

  const removeImage = (): void => {
    setSelectedImage(undefined);
    uploadSelectedFile(undefined);
  };

  const initialView = () => {
    return (
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-col ">
          <input
            id="upload"
            type="file"
            accept="image/*"
            className="hidden"
            multiple={false}
            onChange={uploadFile}
            value=""
          />
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label
            htmlFor="upload"
            className="flex w-full cursor-pointer items-center justify-center gap-y-1 rounded-full border border-neutral-80 py-2 text-base font-medium text-primary-50"
          >
            Upload Picture (under 50 MB)
          </label>
        </div>
        <div className="flex flex-col">
          <input
            id="upload"
            type="file"
            accept="image/*"
            className="hidden"
            multiple={false}
          />
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label
            htmlFor="upload"
            className="flex w-full cursor-pointer items-center justify-center gap-y-1 rounded-full border border-neutral-80 py-2 text-base font-medium text-primary-50"
          >
            Choose System Design
          </label>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-y-4">
      {selectedImage && (
        <div className="relative">
          <Image
            src={selectedImage}
            alt="Selected Image"
            width={400}
            height={400}
            className="max-h-[400px] rounded-lg border border-neutral-80 object-contain text-xs"
          />
          <button
            type="button"
            className="absolute -right-2 -top-2 z-auto cursor-pointer rounded-full bg-primary-60 p-2 hover:bg-primary-40"
            onClick={removeImage}
          >
            <Trash size={16} color="white" />
          </button>
        </div>
      )}

      {initialView()}
    </div>
  );
};
