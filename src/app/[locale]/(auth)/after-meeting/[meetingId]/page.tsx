'use client';

import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { Heart } from '@phosphor-icons/react';
import Image from 'next/image';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

import Button from '@/components/button/Button';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import Rate from '@/components/meeting/Rate';
import { SessionAttendees } from '@/components/schedule/components/sessionCard/SessionAttendees';
import { SessionDateTime } from '@/components/schedule/components/sessionCard/SessionDateTime';
import { useAppSelector } from '@/libs/hooks';
import useDeviceType from '@/libs/hooks/useDeviceType';
import {
  useGetReadingSessionByIdQuery,
  useUpdateReadingSessionMutation,
} from '@/libs/services/modules/reading-session';

export default function FeedbackForm() {
  const router = useRouter();
  const { meetingId } = useParams();
  const searchParams = useSearchParams();
  const storyName = searchParams.get('storyName');
  const userId = useAppSelector((state) => state.auth.userInfo?.id);
  const { deviceType } = useDeviceType();

  const isMobile = deviceType === 'mobile';
  const isTablet = deviceType === 'tablet';

  const t = useTranslations('feedback_form');
  const [step, setStep] = useState<'feedback-sesion' | 'feedback-huber'>(
    'feedback-sesion',
  );
  const [feelingRating, setFeelingRating] = useState(2);
  const [satisfactionRating, setSatisfactionRating] = useState(2);
  const [storyReview, setStoryReview] = useState('');
  const [huberFeedback, setHuberFeedback] = useState('');
  const [loveRating, setLoveRating] = useState(3);
  const { data: readingSession } = useGetReadingSessionByIdQuery(
    {
      id: Number(meetingId),
    },
    {
      skip: !meetingId,
    },
  );

  const [updateReadingSession, { isLoading }] =
    useUpdateReadingSessionMutation();

  const handleNext = async () => {
    try {
      await updateReadingSession({
        id: meetingId,
        ...(step === 'feedback-sesion'
          ? {
              sessionRating: {
                rating: feelingRating,
              },
              storyReview: {
                rating: satisfactionRating,
                content: storyReview,
              },
            }
          : {
              huberFeedback: {
                rating: loveRating,
                content: huberFeedback,
              },
            }),
      }).unwrap();
      pushSuccess('Sent feedback successfully');
      setStep('feedback-huber');
    } catch (error) {
      pushError('Sent feedback failed');
    }
  };

  const handleBack = () => {
    setStep('feedback-sesion');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'center',
        bgcolor: '#f5f5f5',
        p: { xs: 1, sm: 2, md: 3 }, // Responsive padding following Apple's spacing scale
        pt: { xs: 2, sm: 2 }, // Extra top padding for mobile
      }}
    >
      <Paper
        sx={{
          width: '100%',
          maxWidth: {
            xs: '100%', // Full width on mobile for edge-to-edge feel
            sm: '480px', // Tablet-friendly width
            md: '600px', // Desktop optimal width
          },
          // Responsive padding following Apple's 16pt base unit system
          p: {
            xs: 2, // 16px on mobile
            sm: 3, // 24px on tablet
            md: 4, // 32px on desktop
          },
          borderRadius: {
            xs: 2, // 8px radius on mobile
            sm: 3, // 12px radius on tablet/desktop - Apple's preferred corner radius
          },
          boxShadow: {
            xs: '0 1px 3px rgba(0,0,0,0.1)', // Lighter shadow on mobile
            sm: '0 4px 12px rgba(0,0,0,0.08)', // Medium shadow on tablet
            md: '0 8px 24px rgba(0,0,0,0.06)', // Deeper shadow on desktop
          },
          position: 'relative',
          // Apple-style backdrop blur effect for modern feel
          backdropFilter: 'blur(20px)',
          bgcolor: 'rgba(255, 255, 255, 0.95)',
        }}
      >
        {step === 'feedback-sesion' ? (
          <>
            {/* Main heading with responsive typography */}
            <Typography
              variant={isMobile ? 'h5' : 'h4'}
              component="h1"
              align="center"
              fontWeight="bold"
              sx={{
                mb: { xs: 3, sm: 4, md: 3 },
                fontSize: {
                  xs: '1.25rem', // 20px
                  sm: '1.5rem', // 24px
                  md: '1.75rem', // 28px
                },
                lineHeight: { xs: 1.3, sm: 1.4 },
                color: 'text.primary',
              }}
            >
              {t('session_feedback')}
            </Typography>

            {/* Session info components with responsive margins */}
            <Box sx={{ mb: { xs: 3, sm: 4, md: 3 } }}>
              <SessionDateTime
                date={readingSession?.startedAt}
                startDate={readingSession?.startTime}
                endDate={readingSession?.endTime}
              />
            </Box>

            <Box sx={{ mb: { xs: 3, sm: 4, md: 3 } }}>
              <SessionAttendees
                humanBook={readingSession?.humanBook}
                reader={readingSession?.reader}
                isVibing={Number(userId) === Number(readingSession?.reader?.id)}
              />
            </Box>

            {/* Rating sections with improved spacing */}
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

            {/* Story rating section with enhanced mobile experience */}
            <Box sx={{ mb: { xs: 3, sm: 4, md: 2 } }}>
              <Typography
                variant={isMobile ? 'body1' : 'h6'}
                align="center"
                fontWeight="medium"
                sx={{
                  mb: { xs: 2, sm: 2.5, md: 2 },
                  fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
                  px: { xs: 1, sm: 0 },
                }}
              >
                {t('rate_for_story')}{' '}
                <Typography
                  component="span"
                  color="primary"
                  fontWeight="medium"
                  sx={{
                    wordBreak: 'break-word', // Prevent long story names from breaking layout
                  }}
                >
                  {storyName}
                </Typography>
              </Typography>

              {/* Heart rating with improved touch targets */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: { xs: 1, sm: 1.5, md: 2 },
                  px: { xs: 1, sm: 0 },
                }}
              >
                {[0, 1, 2, 3, 4].map((indexRating) => (
                  <IconButton
                    key={indexRating}
                    onClick={(e) => {
                      setLoveRating(indexRating);
                      e.stopPropagation();
                    }}
                    sx={{
                      p: { xs: 0.5, sm: 1 },
                      minWidth: { xs: 44, sm: 48 }, // Apple's minimum touch target
                      minHeight: { xs: 44, sm: 48 },
                      transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      },
                      '&:active': {
                        transform: 'scale(0.95)',
                      },
                      // Touch-specific behavior
                      '@media (hover: none)': {
                        '&:hover': { transform: 'none' },
                        '&:active': { transform: 'scale(0.95)' },
                      },
                    }}
                  >
                    <Heart
                      size={isMobile ? 36 : isTablet ? 40 : 42}
                      weight="fill"
                      color={indexRating <= loveRating ? '#F3C00C' : '#E0E0E0'}
                    />
                  </IconButton>
                ))}
              </Box>
            </Box>

            {/* Text input with responsive sizing */}
            <Box sx={{ mb: { xs: 3, sm: 4, md: 2 } }}>
              <TextField
                placeholder={t('share_thought')}
                multiline
                rows={isMobile ? 3 : 4} // Fewer rows on mobile to save space
                fullWidth
                variant="outlined"
                value={storyReview}
                onChange={(e) => setStoryReview(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: { xs: 2, sm: 3 }, // Apple-style corner radius
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    '& fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.12)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(4, 66, 191, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#0442BF',
                      borderWidth: '2px',
                    },
                  },
                  '& .MuiInputBase-input': {
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    lineHeight: 1.5,
                  },
                }}
              />
            </Box>

            {/* Action buttons with responsive layout */}
            <Box
              sx={{
                display: 'flex',
                gap: { xs: 2, sm: 2 },
                flexDirection: { xs: 'column', sm: 'row' }, // Stack vertically on mobile
              }}
            >
              <Button
                fullWidth
                variant="outline"
                disabled={isLoading}
                size={isMobile ? 'md' : 'lg'}
              >
                {t('cancel')}
              </Button>
              <Button
                fullWidth
                onClick={handleNext}
                disabled={isLoading}
                size={isMobile ? 'md' : 'lg'}
              >
                {t('next')}
              </Button>
            </Box>
          </>
        ) : (
          <>
            {/* Second step - Huber feedback */}
            <Typography
              variant={isMobile ? 'h5' : 'h4'}
              component="h1"
              align="center"
              fontWeight="bold"
              sx={{
                mb: { xs: 3, sm: 4, md: 3 },
                fontSize: {
                  xs: '1.25rem',
                  sm: '1.5rem',
                  md: '1.75rem',
                },
                lineHeight: { xs: 1.3, sm: 1.4 },
              }}
            >
              {t('feedback_for_huber')}
            </Typography>

            {/* Huber info section with responsive layout */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: { xs: 1.5, sm: 2 },
                mb: { xs: 3, sm: 4, md: 3 },
                flexWrap: { xs: 'wrap', sm: 'nowrap' },
                px: { xs: 1, sm: 0 },
              }}
            >
              <Avatar
                sx={{
                  width: { xs: 32, sm: 40 },
                  height: { xs: 32, sm: 40 },
                }}
              >
                <Image
                  src="/placeholder.svg?height=40&width=40"
                  alt="Avatar"
                  width={40}
                  height={40}
                />
              </Avatar>
              <Chip
                label="Huber"
                size={isMobile ? 'small' : 'medium'}
                sx={{
                  bgcolor: '#E3F2FD',
                  color: '#1565C0',
                  borderRadius: '16px',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                }}
              />
              <Typography
                sx={{
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  textAlign: { xs: 'center', sm: 'left' },
                  flex: { xs: '1 1 100%', sm: 'auto' },
                }}
              >
                Đinh Tiến Đạt
              </Typography>
            </Box>

            {/* Love rating section */}
            <Box sx={{ mb: { xs: 3, sm: 4, md: 2 } }}>
              <Typography
                variant={isMobile ? 'body1' : 'h6'}
                align="center"
                fontWeight="medium"
                sx={{
                  mb: { xs: 2, sm: 2.5, md: 2 },
                  fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
                  px: { xs: 1, sm: 0 },
                }}
              >
                {t('how_many_love')}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: { xs: 1, sm: 1.5, md: 2 },
                  px: { xs: 1, sm: 0 },
                }}
              >
                {[0, 1, 2, 3, 4].map((indexRating) => (
                  <IconButton
                    key={indexRating}
                    onClick={(e) => {
                      setLoveRating(indexRating);
                      e.stopPropagation();
                    }}
                    sx={{
                      p: { xs: 0.5, sm: 1 },
                      minWidth: { xs: 44, sm: 48 },
                      minHeight: { xs: 44, sm: 48 },
                      transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      },
                      '&:active': {
                        transform: 'scale(0.95)',
                      },
                      '@media (hover: none)': {
                        '&:hover': { transform: 'none' },
                        '&:active': { transform: 'scale(0.95)' },
                      },
                    }}
                  >
                    <Heart
                      size={isMobile ? 36 : isTablet ? 40 : 42}
                      weight="fill"
                      color={indexRating <= loveRating ? '#EC407A' : '#E0E0E0'}
                    />
                  </IconButton>
                ))}
              </Box>
            </Box>

            {/* Feedback text input */}
            <Box sx={{ mb: { xs: 3, sm: 4, md: 2 } }}>
              <Typography
                variant={isMobile ? 'body2' : 'subtitle1'}
                fontWeight="medium"
                sx={{
                  mb: { xs: 1.5, sm: 2 },
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                }}
              >
                {t('say_something')}
              </Typography>
              <TextField
                placeholder={t('write_something')}
                multiline
                rows={isMobile ? 3 : 4}
                fullWidth
                variant="outlined"
                value={huberFeedback}
                onChange={(e) => setHuberFeedback(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: { xs: 2, sm: 3 },
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    '& fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.12)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(4, 66, 191, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#0442BF',
                      borderWidth: '2px',
                    },
                  },
                  '& .MuiInputBase-input': {
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    lineHeight: 1.5,
                  },
                }}
              />
            </Box>

            {/* Final action buttons */}
            <Box
              sx={{
                display: 'flex',
                gap: { xs: 2, sm: 2 },
                flexDirection: { xs: 'column', sm: 'row' },
              }}
            >
              <Button
                variant="outline"
                fullWidth
                onClick={handleBack}
                size={isMobile ? 'md' : 'lg'}
              >
                {t('back')}
              </Button>
              <Button
                fullWidth
                onClick={() => router.push('/after-meeting/thanks')}
                size={isMobile ? 'md' : 'lg'}
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
