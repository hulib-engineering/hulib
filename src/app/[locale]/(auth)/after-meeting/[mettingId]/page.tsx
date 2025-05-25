'use client';

import {
  CalendarMonth,
  Check,
  KeyboardArrowDown,
  Person,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { Heart } from '@phosphor-icons/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

import Button from '@/components/button/Button';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import { useUpdateStatusReadingSessionMutation } from '@/libs/services/modules/reading-session';

type RateProps = {
  question: string;
  rateLowestText: string;
  rateHighestText: string;
  selectedRating: number;
  setSelectedRating: (rating: number) => void;
};

const Rate = ({
  question,
  rateLowestText,
  rateHighestText,
  selectedRating,
  setSelectedRating,
}: RateProps) => {
  const ratingImages = [
    '/assets/images/after-meeting/rate-1.png',
    '/assets/images/after-meeting/rate-2.png',
    '/assets/images/after-meeting/rate-3.png',
    '/assets/images/after-meeting/rate-4.png',
    '/assets/images/after-meeting/rate-5.png',
  ];

  return (
    <Box sx={{ mb: 2 }}>
      <p className="text-center text-base font-medium text-neutral-10">
        {question}
      </p>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 5.5 }}>
        {ratingImages.map((image, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <IconButton
              sx={{
                mb: 1,
                height: 48,
                width: 48,
                bgcolor: selectedRating === index ? '#0442BF' : 'transparent',
                color: selectedRating === index ? 'white' : 'inherit',
                '&:hover': {
                  bgcolor:
                    selectedRating === index
                      ? '#0442BF'
                      : 'rgba(0, 0, 0, 0.04)',
                },
              }}
              onClick={() => setSelectedRating(index)}
            >
              <Image
                src={image}
                alt="Rating"
                width={32}
                height={32}
                className="h-8 w-8"
              />
            </IconButton>
            {index === 0 && (
              <Typography variant="caption">{rateLowestText}</Typography>
            )}
            {index === 4 && (
              <Typography variant="caption">{rateHighestText}</Typography>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default function FeedbackForm() {
  const router = useRouter();
  const t = useTranslations('feedback_form');
  const [step, setStep] = useState<'feedback-sesion' | 'feedback-huber'>(
    'feedback-sesion',
  );
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [feelingRating, setFeelingRating] = useState(2);
  const [satisfactionRating, setSatisfactionRating] = useState(2);
  const [loveRating, setLoveRating] = useState(3);

  const tagOptions = [
    t('tags.self_taught'),
    t('tags.optimistic'),
    t('tags.energy'),
    t('tags.select_option'),
  ];

  const [updateStatusReadingSession, { isLoading }] =
    useUpdateStatusReadingSessionMutation();

  const handleNext = async () => {
    try {
      await updateStatusReadingSession({
        id: 1,
        sessionFeedback: {
          rating: feelingRating,
          content: '',
        },
      }).unwrap();
      pushSuccess('Cập nhật trạng thái thành công');
      setStep('feedback-huber');
    } catch (error) {
      pushError('Có lỗi xảy ra, vui lòng thử lại');
    }
  };

  const handleBack = () => {
    setStep('feedback-sesion');
  };

  const handleTagSelect = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f5f5',
        p: 2,
      }}
    >
      <Paper
        sx={{
          width: '100%',
          maxWidth: '600px',
          p: 3,
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          position: 'relative',
        }}
      >
        {step === 'feedback-sesion' ? (
          <>
            <Typography
              variant="h5"
              component="h1"
              align="center"
              fontWeight="bold"
              mb={3}
            >
              {t('session_feedback')}
            </Typography>

            <div className="flex items-center gap-1 text-neutral-20">
              <CalendarMonth color="primary" fontSize="small" />
              <Typography>Tue, 02/02/2025 | 14:00 - 14:30</Typography>
            </div>
            <div className="flex items-center gap-1 text-sm text-neutral-20">
              <Person color="primary" fontSize="small" />
              <Typography>{t('attendees', { count: 2 })}</Typography>
            </div>

            <Box sx={{ mb: 3 }}>
              <Box
                sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ width: 32, height: 32 }}>
                    <Image
                      src="/assets/images/Avatar.png"
                      alt="Avatar"
                      width={32}
                      height={32}
                    />
                  </Avatar>
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    <Chip
                      label="Liber"
                      size="small"
                      sx={{
                        bgcolor: '#FFF3E0',
                        color: '#E65100',
                        borderRadius: '16px',
                      }}
                    />
                    <p className="text-center font-medium text-neutral-10">
                      Hari Won ({t('you')})
                    </p>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ width: 32, height: 32 }}>
                    <Image
                      src="/assets/images/Avatar.png"
                      alt="Avatar"
                      width={32}
                      height={32}
                    />
                  </Avatar>
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    <Chip
                      label="Huber"
                      size="small"
                      sx={{
                        bgcolor: '#E3F2FD',
                        color: '#1565C0',
                        borderRadius: '16px',
                      }}
                    />
                    <p className="text-center font-medium text-neutral-10">
                      Đinh Tiến Đạt
                    </p>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Rate
              question={t('how_do_you_feel')}
              selectedRating={feelingRating}
              setSelectedRating={setFeelingRating}
              rateLowestText={t('not_good')}
              rateHighestText={t('very_good')}
            />

            <Rate
              question={t('did_session_satisfy')}
              selectedRating={satisfactionRating}
              setSelectedRating={setSatisfactionRating}
              rateLowestText={t('not_satisfied')}
              rateHighestText={t('very_satisfied')}
            />

            <Box sx={{ mb: 2 }}>
              <Typography
                variant="subtitle1"
                align="center"
                fontWeight="medium"
                mb={2}
              >
                {t('rate_for_story')}{' '}
                <Typography
                  component="span"
                  color="primary"
                  fontWeight="medium"
                >
                  Cứ làm đi biết đâu thất bại
                </Typography>
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                {[0, 1, 2, 3, 4].map((indexRating) => (
                  <IconButton
                    key={indexRating}
                    onClick={() => setLoveRating(indexRating)}
                    sx={{ p: 0 }}
                  >
                    <Heart
                      size={42}
                      weight="fill"
                      color={indexRating <= loveRating ? '#F3C00C' : '#E0E0E0'}
                    />
                  </IconButton>
                ))}
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <TextField
                placeholder={t('share_thought')}
                multiline
                rows={4}
                fullWidth
                variant="outlined"
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button fullWidth variant="outline" disabled={isLoading}>
                {t('cancel')}
              </Button>
              <Button fullWidth onClick={handleNext} disabled={isLoading}>
                {t('next')}
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Typography
              variant="h5"
              component="h1"
              align="center"
              fontWeight="bold"
              mb={3}
            >
              {t('feedback_for_huber')}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                mb: 3,
              }}
            >
              <Avatar sx={{ width: 40, height: 40 }}>
                <Image
                  src="/placeholder.svg?height=40&width=40"
                  alt="Avatar"
                  width={40}
                  height={40}
                />
              </Avatar>
              <Chip
                label="Huber"
                size="small"
                sx={{
                  bgcolor: '#E3F2FD',
                  color: '#1565C0',
                  borderRadius: '16px',
                }}
              />
              <Typography>Đinh Tiến Đạt</Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography
                variant="subtitle1"
                align="center"
                fontWeight="medium"
                mb={2}
              >
                {t('how_many_love')}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                {[0, 1, 2, 3, 4].map((index) => (
                  <IconButton
                    key={index}
                    onClick={() => setLoveRating(index)}
                    sx={{ p: 0 }}
                  >
                    <Typography
                      fontSize="28px"
                      color={index <= loveRating ? '#EC407A' : '#E0E0E0'}
                    >
                      ❤️
                    </Typography>
                  </IconButton>
                ))}
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="medium" mb={2}>
                {t('say_something')}
              </Typography>
              <TextField
                placeholder={t('write_something')}
                multiline
                rows={4}
                fullWidth
                variant="outlined"
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="medium" mb={2}>
                {t('what_tag')}
              </Typography>
              <Box sx={{ position: 'relative' }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: 1,
                    p: 1.5,
                    border: '1px solid #ccc',
                    borderRadius: 1,
                    minHeight: '48px',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: '#1976d2',
                    },
                  }}
                  onClick={handleOpenMenu}
                >
                  {selectedTags.length > 0 ? (
                    selectedTags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        sx={{
                          bgcolor: '#E3F2FD',
                          color: '#1565C0',
                          borderRadius: '16px',
                        }}
                        onDelete={() => handleRemoveTag(tag)}
                      />
                    ))
                  ) : (
                    <Typography color="text.secondary">
                      {t('choose_tag')}
                    </Typography>
                  )}
                  <KeyboardArrowDown sx={{ ml: 'auto' }} />
                </Box>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleCloseMenu}
                  PaperProps={{
                    style: {
                      width: anchorEl?.clientWidth,
                      maxHeight: 300,
                      marginTop: 8,
                    },
                  }}
                >
                  {tagOptions.map((tag) => (
                    <MenuItem
                      key={tag}
                      onClick={() => {
                        handleTagSelect(tag);
                        handleCloseMenu();
                      }}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        bgcolor: selectedTags.includes(tag)
                          ? '#E3F2FD'
                          : 'transparent',
                        '&:hover': {
                          bgcolor: selectedTags.includes(tag)
                            ? '#E3F2FD'
                            : '#f5f5f5',
                        },
                      }}
                    >
                      {tag}
                      {selectedTags.includes(tag) && (
                        <Check sx={{ color: '#1976d2' }} />
                      )}
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="outline" fullWidth onClick={handleBack}>
                {t('back')}
              </Button>
              <Button
                fullWidth
                onClick={() => router.push('/after-metting/thanks')}
              >
                {t('confirm')}
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
}
