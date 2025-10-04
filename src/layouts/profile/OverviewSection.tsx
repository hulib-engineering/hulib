'use client';

import { Heart, PencilSimple, PlayCircle, Warning } from '@phosphor-icons/react';
import { useLocale } from 'next-intl';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import Avatar from '@/components/core/avatar/Avatar';
import Button from '@/components/core/button/Button';
import { Chip } from '@/components/common/chip/Chip';
import IconButton from '@/components/core/iconButton/IconButton';
import { mergeClassnames } from '@/components/core/private/utils';
import TextArea from '@/components/core/textArea/TextArea';
import type { User } from '@/features/users/types';
import { useUpdateProfileMutation } from '@/libs/services/modules/auth';
import { Role } from '@/types/common';
import { toLocaleDateString } from '@/utils/dateUtils';
import TextInput from '@/components/core/textInput-v1/TextInput';

type IOverviewSectionProps = {
  data: User;
  editable?: boolean;
};

const OverviewSection = ({ data, editable }: IOverviewSectionProps) => {
  const isHuber = data.role?.id === Role.HUBER;

  const locale = useLocale();

  const [updateProfile, { isLoading: isSubmitting }]
    = useUpdateProfileMutation();

  const videoRef = useRef<HTMLVideoElement>(null);

  const [openEditPopup, setOpenEditPopup] = useState(false);
  const [isEditingVideoSrc, setIsEditingVideoSrc] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [invalidVideoMsg, setInvalidVideoMsg] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<{ bio: string; videoUrl: string }>({
    defaultValues: { bio: data?.bio || '', videoUrl: data?.videoUrl || '' },
  });

  const onSubmit = async (formData: { bio: string; videoUrl: string }) => {
    setErrorMessage(null);
    try {
      await updateProfile({ bio: formData.bio, videoUrl: formData.videoUrl }).unwrap();
      setIsEditingVideoSrc(false);
      setOpenEditPopup(false);
    } catch (error) {
      setErrorMessage('Failed to update profile. Please try again.');
    }
  };
  const togglePlay = () => {
    if (!videoRef.current) {
      return;
    }
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsVideoPlaying(true);
    } else {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  };

  return (
    <>
      {isHuber && data?.humanBookTopic && data?.humanBookTopic?.length > 0 && (
        <div className="flex flex-col gap-2 border-b-[0.5px] border-neutral-90 py-3 lg:gap-4 lg:border-none lg:py-0">
          <p className="font-medium text-black">Topic</p>
          <div className="flex flex-row gap-x-2">
            {data?.humanBookTopic?.map(topic => (
              <Chip
                key={topic?.topicId}
                className="h-full rounded-2xl border border-primary-80 bg-primary-90 p-2 text-xs font-medium leading-[14px] text-primary-60"
              >
                {topic?.topic?.name}
              </Chip>
            ))}
          </div>
        </div>
      )}
      <div className="flex flex-col gap-2 border-b-[0.5px] border-neutral-90 py-3 lg:gap-4 lg:border-none lg:py-0">
        <div className="flex items-center justify-between">
          <p className="font-medium text-black">Bio</p>
          {editable && !openEditPopup && !isEditingVideoSrc && (
            <IconButton variant="secondary" size="sm" className="p-2" onClick={() => setOpenEditPopup(true)}>
              <PencilSimple weight="bold" />
            </IconButton>
          )}
        </div>
        {openEditPopup
          ? (
              <form
                className="flex flex-col gap-y-2"
                onSubmit={handleSubmit(onSubmit)}
              >
                <TextArea rows={4} {...register('bio')} error={!!errorMessage || !!errors?.bio} />
                <div className="flex justify-end gap-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isSubmitting}
                    onClick={() => {
                      reset({ bio: data?.bio || '' });
                      setOpenEditPopup(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isSubmitting}
                    animation={isSubmitting && 'progress'}
                  >
                    {isSubmitting ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </form>
            )
          : (
              <p className="text-sm text-neutral-20">{data?.bio}</p>
            )}
      </div>
      {isHuber && (
        <div className="flex flex-col gap-5 border-b-[0.5px] border-neutral-90 py-3 lg:gap-4 lg:border-none lg:py-0">
          <div className="flex items-center justify-between">
            <p className="font-medium text-black">Video Introduction</p>
            {editable && !isEditingVideoSrc && !openEditPopup && (
              <IconButton
                variant="secondary"
                size="sm"
                className="p-2"
                onClick={() => setIsEditingVideoSrc(true)}
              >
                <PencilSimple weight="bold" />
              </IconButton>
            )}
          </div>
          {isEditingVideoSrc ? (
            <div className="flex flex-col gap-3">
              <TextInput
                id="videoUrl"
                type="text"
                label=""
                placeholder="https://www.youtube.com/embed/video"
                {...register('videoUrl')}
                isError={!!errors.videoUrl}
                hintText={errors.videoUrl?.message}
              />
              <div className="flex items-center justify-end gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  disabled={isSubmitting}
                  onClick={() => {
                    reset({ videoUrl: data?.videoUrl || '' });
                    setIsEditingVideoSrc(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="lg"
                  disabled={isSubmitting}
                  animation={isSubmitting && 'progress'}
                  onClick={handleSubmit(onSubmit)}
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="relative h-[205px] w-full overflow-hidden rounded-lg border-[0.8px] border-primary-90 lg:max-w-[414px]">
              {(() => {
                const url = data?.videoUrl || '';
                const youtubeMatch = url.match(
                  /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/,
                );
                if (youtubeMatch) {
                  // ✅ YouTube embed
                  return (
                    <iframe
                      className="size-full"
                      src={`https://www.youtube.com/embed/${youtubeMatch[1]}`}
                      title="YouTube video player"
                      sandbox="allow-same-origin allow-scripts allow-popups allow-presentation"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  );
                }
                // ✅ Direct .mp4 / .webm
                return (
                  <>
                    {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                    <video
                      ref={videoRef}
                      src={url}
                      className="size-full bg-black object-cover"
                      controls={isVideoPlaying}
                      onPause={() => setIsVideoPlaying(false)}
                      onPlay={() => setIsVideoPlaying(true)}
                      onError={() => setInvalidVideoMsg('Invalid video source')}
                      onLoadedData={() => setInvalidVideoMsg(null)}
                    >
                      Your browser does not support HTML video.
                    </video>

                    {!isVideoPlaying && !invalidVideoMsg && (
                      <button
                        type="button"
                        onClick={togglePlay}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <PlayCircle className="text-5xl text-[#EBEDF0]" />
                      </button>
                    )}

                    {invalidVideoMsg && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-[14px]">
                        <div className="flex flex-col items-center gap-[5px]">
                          <Warning className="text-neutral-80" weight="fill" size={32} />
                          <p className="font-medium text-neutral-98">{invalidVideoMsg}</p>
                        </div>
                        <Button size="sm" onClick={() => setIsEditingVideoSrc(true)}>
                          Add video source
                        </Button>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}
      <div className="flex flex-col gap-3 py-3 lg:gap-4 lg:py-0">
        <div className="py-2 font-medium text-black">
          What libers say
        </div>
        <div className="flex max-h-[684px] flex-col gap-6 overflow-y-auto px-5">
          {data?.feedbackBys.length > 0 && data?.feedbackBys.map((feedback, index) => (
            <div
              key={feedback.id}
              className={mergeClassnames(
                'flex flex-col gap-2 pb-5',
                index !== data?.feedbackBys.length - 1 && 'border-b-[0.5px] border-neutral-90',
              )}
            >
              <div className="flex items-center gap-2">
                <Avatar imageUrl={feedback.feedbackBy.photo} className="size-11" />
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-black">{feedback.feedbackBy.fullName}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, index) => (
                        <Heart
                          key={index}
                          weight="fill"
                          className={mergeClassnames(
                            feedback.rating > index ? 'text-pink-50' : 'text-neutral-90',
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-xs leading-6 text-black/50">
                      {toLocaleDateString(feedback.createdAt, locale === 'en' ? 'en-GB' : 'vi-VN')}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-black/80">{feedback.content}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default OverviewSection;
