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
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

export default function FeedbackForm() {
  const router = useRouter();
  const t = useTranslations('FeedbackForm');
  const [step, setStep] = useState(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Track selected ratings with default middle option (index 2)
  const [feelingRating, setFeelingRating] = useState(2);
  const [satisfactionRating, setSatisfactionRating] = useState(2);
  const [loveRating, setLoveRating] = useState(3); // Default to 4 hearts (index 3)

  const tagOptions = [
    t('tags.selfTaught'),
    t('tags.optimistic'),
    t('tags.energy'),
    t('tags.selectOption'),
  ];

  const feelingEmojis = ['😢', '😔', '😐', '🙂', '😍'];
  const satisfactionEmojis = ['😢', '😔', '😐', '🙂', '😍'];

  const handleNext = () => {
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
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
        {step === 1 ? (
          <>
            <Typography
              variant="h5"
              component="h1"
              align="center"
              fontWeight="bold"
              mb={3}
            >
              {t('sessionFeedback')}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                mb: 3,
                color: 'text.secondary',
              }}
            >
              <CalendarMonth color="primary" fontSize="small" />
              <Typography>Tue, 02/02/2025 | 14:00 - 14:30</Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: 'text.secondary',
                }}
              >
                <Person color="primary" fontSize="small" />
                <Typography>{t('attendees', { count: 2 })}</Typography>
              </Box>

              <Box
                sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ width: 40, height: 40 }}>
                    <Image
                      src="/placeholder.svg?height=40&width=40"
                      alt="Avatar"
                      width={40}
                      height={40}
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
                    <Chip
                      label="[Thân bùm]"
                      size="small"
                      sx={{
                        bgcolor: '#F3E5F5',
                        color: '#7B1FA2',
                        borderRadius: '16px',
                      }}
                    />
                    <Typography>Hari Won ({t('you')})</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ width: 40, height: 40 }}>
                    <Image
                      src="/placeholder.svg?height=40&width=40"
                      alt="Avatar"
                      width={40}
                      height={40}
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
                    <Chip
                      label="[Thợ lặn]"
                      size="small"
                      sx={{
                        bgcolor: '#FFEBEE',
                        color: '#C62828',
                        borderRadius: '16px',
                      }}
                    />
                    <Typography>Đinh Tiến Đạt</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography
                variant="subtitle1"
                align="center"
                fontWeight="medium"
                mb={2}
              >
                {t('howDoYouFeel')}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {feelingEmojis.map((emoji, index) => (
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
                        bgcolor:
                          feelingRating === index ? '#2196f3' : 'transparent',
                        color: feelingRating === index ? 'white' : 'inherit',
                        '&:hover': {
                          bgcolor:
                            feelingRating === index
                              ? '#1976d2'
                              : 'rgba(0, 0, 0, 0.04)',
                        },
                      }}
                      onClick={() => setFeelingRating(index)}
                    >
                      <Typography fontSize="24px">{emoji}</Typography>
                    </IconButton>
                    {index === 0 && (
                      <Typography variant="caption">{t('notGood')}</Typography>
                    )}
                    {index === 4 && (
                      <Typography variant="caption">{t('veryGood')}</Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography
                variant="subtitle1"
                align="center"
                fontWeight="medium"
                mb={2}
              >
                {t('didSessionSatisfy')}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {satisfactionEmojis.map((emoji, index) => (
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
                        bgcolor:
                          satisfactionRating === index
                            ? '#2196f3'
                            : 'transparent',
                        color:
                          satisfactionRating === index ? 'white' : 'inherit',
                        '&:hover': {
                          bgcolor:
                            satisfactionRating === index
                              ? '#1976d2'
                              : 'rgba(0, 0, 0, 0.04)',
                        },
                      }}
                      onClick={() => setSatisfactionRating(index)}
                    >
                      <Typography fontSize="24px">{emoji}</Typography>
                    </IconButton>
                    {index === 0 && (
                      <Typography variant="caption">
                        {t('notSatisfied')}
                      </Typography>
                    )}
                    {index === 4 && (
                      <Typography variant="caption">
                        {t('verySatisfied')}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography
                variant="subtitle1"
                align="center"
                fontWeight="medium"
                mb={2}
              >
                {t('rateForStory')}{' '}
                <Typography
                  component="span"
                  color="primary"
                  fontWeight="medium"
                >
                  Cứ làm đi biết đâu thất bại
                </Typography>
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                {[0, 1, 2, 3, 4].map((index) => (
                  <IconButton key={index} onClick={() => {}} sx={{ p: 0 }}>
                    <Typography
                      fontSize="28px"
                      color={index <= 3 ? '#FFD700' : '#E0E0E0'}
                    >
                      ❤️
                    </Typography>
                  </IconButton>
                ))}
              </Box>
            </Box>

            <Box sx={{ mb: 4 }}>
              <TextField
                placeholder={t('shareThought')}
                multiline
                rows={4}
                fullWidth
                variant="outlined"
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                sx={{ borderRadius: 1, py: 1 }}
              >
                {t('cancel')}
              </Button>
              <Button
                variant="contained"
                fullWidth
                sx={{ borderRadius: 1, py: 1, bgcolor: '#1976d2' }}
                onClick={handleNext}
              >
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
              {t('feedbackForHuber')}
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

            <Box sx={{ mb: 4 }}>
              <Typography
                variant="subtitle1"
                align="center"
                fontWeight="medium"
                mb={2}
              >
                {t('howManyLove')}
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

            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" fontWeight="medium" mb={2}>
                {t('saySomething')}
              </Typography>
              <TextField
                placeholder={t('writeSomething')}
                multiline
                rows={4}
                fullWidth
                variant="outlined"
              />
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" fontWeight="medium" mb={2}>
                {t('whatTag')}
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
                      {t('chooseTag')}
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
              <Button
                variant="outlined"
                fullWidth
                sx={{ borderRadius: 1, py: 1 }}
                onClick={handleBack}
              >
                {t('back')}
              </Button>
              <Button
                variant="contained"
                fullWidth
                sx={{ borderRadius: 1, py: 1, bgcolor: '#1976d2' }}
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
