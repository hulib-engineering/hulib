'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';

import Button from '@/components/core/button/Button';
import TextArea from '@/components/core/textArea/TextArea';
import TextInput from '@/components/core/textInput-v1/TextInput';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import {
  AdminStoryCoverPreview,
  AdminStoryCoverThumbnail,
} from '@/features/stories/components/AdminStoryCoverPreview';
import {
  COVER_PRESET_ASSETS,
  COVER_PREVIEW_ELEMENT_ID,
  type CoverPresetAsset,
} from '@/features/stories/constants';
import type { CoverCustomization } from '@/features/stories/types';
import {
  getAdminPresetCustomization,
  isPresetCoverAsset,
  isRasterizedStoryCover,
} from '@/features/stories/utils';
import { saveStoryCoverFile } from '@/features/stories/utils/saveStoryCover';
import { useUploadMutation } from '@/libs/services/modules/files';
import { useUpdateStoryMutation } from '@/libs/services/modules/stories';
import type { Story } from '@/libs/services/modules/stories/storiesType';

const inferPresetAsset = (coverPath?: string): CoverPresetAsset => {
  if (coverPath?.includes('story_background_red')) {
    return COVER_PRESET_ASSETS[1]!;
  }
  if (coverPath?.includes('story_background_blue')) {
    return COVER_PRESET_ASSETS[2]!;
  }
  return COVER_PRESET_ASSETS[0]!;
};

type AdminStoryCoverFormProps = {
  story: Story;
  onSaved?: () => void;
};

export const AdminStoryCoverForm = ({ story, onSaved }: AdminStoryCoverFormProps) => {
  const t = useTranslations('Common');
  const [uploadCover] = useUploadMutation();
  const [updateStory, { isLoading: isUpdating }] = useUpdateStoryMutation();

  const initialPreset = inferPresetAsset(story.cover?.path);
  const [selectedPreset, setSelectedPreset] = useState<CoverPresetAsset>(initialPreset);
  const [customization, setCustomization] = useState<CoverCustomization>(
    () => getAdminPresetCustomization(initialPreset),
  );
  const [coverTitle, setCoverTitle] = useState(story.title);
  const [isSaving, setIsSaving] = useState(false);

  const authorName = story.humanBook?.fullName ?? '';
  const currentCoverPath = story.cover?.path?.trim() ?? '';
  const needsBackfill = !isRasterizedStoryCover(currentCoverPath);
  const isLegacyPresetInDb = isPresetCoverAsset(currentCoverPath);

  const handleSelectPreset = useCallback((preset: CoverPresetAsset) => {
    setSelectedPreset(preset);
    setCustomization(getAdminPresetCustomization(preset));
  }, []);

  const handleSave = async () => {
    const trimmedTitle = coverTitle.trim();
    if (!trimmedTitle) {
      pushError(t('error_contact_admin'));
      return;
    }
    if (!authorName.trim()) {
      pushError('Author name is missing on this story.');
      return;
    }

    setIsSaving(true);
    try {
      const fileId = await saveStoryCoverFile(
        uploadCover,
        `story-${story.id}-cover`,
        COVER_PREVIEW_ELEMENT_ID,
      );
      if (!fileId) {
        pushError(t('error_contact_admin'));
        return;
      }

      await updateStory({
        id: story.id,
        cover: { id: fileId },
      }).unwrap();

      pushSuccess('Cover saved. Title and author are now baked into the image.');
      onSaved?.();
    } catch (err) {
      console.error('Admin cover save failed', err);
      const apiMessage = (err as { data?: { errors?: { file?: string } } })?.data?.errors?.file;
      pushError(
        apiMessage === 'cantUploadFileType'
          ? 'Cover upload failed: file must be a PNG image.'
          : t('error_contact_admin'),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const isBusy = isSaving || isUpdating;

  return (
    <div className="flex flex-col gap-6">
      {needsBackfill && (
        <p className="bg-amber-98 text-amber-30 rounded-lg px-4 py-3 text-sm">
          This story still uses a preset background URL without baked title/author text.
          Save a new cover image before publishing.
        </p>
      )}

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex flex-1 flex-col gap-4">
          <TextInput
            type="text"
            label={(
              <p className="text-sm leading-4 text-neutral-10">Title on cover</p>
            )}
            value={coverTitle}
            onChange={e => setCoverTitle(e.target.value)}
            maxLength={32}
          />
          <TextInput
            type="text"
            label={(
              <p className="text-sm leading-4 text-neutral-10">Author on cover</p>
            )}
            value={authorName}
            disabled
          />
          <div>
            <p className="mb-2 text-sm leading-4 text-neutral-10">Story description</p>
            <TextArea
              value={story.abstract}
              readOnly
              rows={6}
              size="sm"
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-neutral-10">Cover style</p>
            <div className="flex flex-wrap gap-3">
              {COVER_PRESET_ASSETS.map((preset, index) => (
                <div key={preset} className="flex shrink-0 flex-col items-center gap-1">
                  <AdminStoryCoverThumbnail
                    storyTitle={coverTitle.trim() || t('placeholder_title')}
                    authorName={authorName}
                    coverImgSrc={preset}
                    customization={getAdminPresetCustomization(preset)}
                    selected={selectedPreset === preset}
                    onSelect={() => handleSelectPreset(preset)}
                  />
                  <span className="text-xs text-neutral-40">{`${t('style')} ${index + 1}`}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 lg:min-w-[200px]">
          <div className="text-center">
            <p className="text-sm font-medium text-neutral-10">New cover (preview)</p>
            <p className="text-xs text-neutral-40">
              Title and author are drawn on the preset — this is what Save will upload.
            </p>
          </div>
          <AdminStoryCoverPreview
            storyTitle={coverTitle.trim() || t('placeholder_title')}
            authorName={authorName}
            coverImgSrc={selectedPreset}
            customization={customization}
          />
          <div className="w-full border-t border-neutral-90 pt-4">
            <p className="mb-1 text-sm font-medium text-neutral-10">Current cover in database</p>
            <p className="mb-2 text-xs text-neutral-40">
              {isLegacyPresetInDb
                ? 'Stored file is the preset PNG only — no title or author in the image (prod showed text via code overlay).'
                : needsBackfill
                  ? 'No rasterized cover file yet.'
                  : 'Rasterized PNG already stored (title and author are in the file).'}
            </p>
            {currentCoverPath ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentCoverPath}
                alt="Current cover in database"
                width={184}
                height={259}
                className="mx-auto shrink-0 rounded-[4px] object-fill"
              />
            ) : (
              <p className="text-center text-xs text-neutral-40">No cover path on this story.</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          size="lg"
          className="min-w-[200px]"
          animation={isBusy ? 'progress' : undefined}
          disabled={isBusy}
          onClick={handleSave}
        >
          Save cover to database
        </Button>
      </div>
    </div>
  );
};
