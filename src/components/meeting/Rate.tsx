import { Box, IconButton, Typography } from '@mui/material';
import Image from 'next/image';

import { useDeviceType } from '@/libs/hooks';

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
  const { deviceType } = useDeviceType();
  const isMobile = deviceType === 'mobile';
  const isTablet = deviceType === 'tablet';

  // Apple HIG: Touch targets should be at least 44pt on iOS, translated to responsive web design
  const buttonSize = isMobile ? 40 : isTablet ? 44 : 48;
  const imageSize = isMobile ? 24 : isTablet ? 28 : 32;
  const gapSize = isMobile ? 1.5 : isTablet ? 3 : 5.5;

  const ratingImages = [
    '/assets/images/after-meeting/rate-1.png',
    '/assets/images/after-meeting/rate-2.png',
    '/assets/images/after-meeting/rate-3.png',
    '/assets/images/after-meeting/rate-4.png',
    '/assets/images/after-meeting/rate-5.png',
  ];

  return (
    <Box sx={{ mb: { xs: 3, sm: 4, md: 2 } }}>
      {/* Question with responsive typography following Apple's type scale */}
      <Typography
        variant={isMobile ? 'body1' : 'h6'}
        align="center"
        fontWeight="medium"
        sx={{
          color: 'neutral.10',
          mb: { xs: 2, sm: 2.5, md: 3 },
          fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
          lineHeight: { xs: 1.4, sm: 1.5, md: 1.6 },
          px: { xs: 1, sm: 2 }, // Prevent text from touching edges on small screens
        }}
      >
        {question}
      </Typography>

      {/* Rating buttons with proper touch targets and spacing */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: gapSize,
          px: { xs: 1, sm: 0 }, // Add padding on mobile to prevent overflow
          flexWrap: isMobile ? 'nowrap' : 'nowrap', // Keep in one line but allow scroll if needed
          overflowX: isMobile ? 'auto' : 'visible',
        }}
      >
        {ratingImages.map((image, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: 'fit-content', // Prevent squishing on small screens
            }}
          >
            {/* Rating button with enhanced touch interaction */}
            <IconButton
              sx={{
                mb: { xs: 0.5, sm: 0.75, md: 1 },
                height: buttonSize,
                width: buttonSize,
                bgcolor: selectedRating === index ? '#0442BF' : 'transparent',
                color: selectedRating === index ? 'white' : 'inherit',
                border:
                  selectedRating === index ? 'none' : '1px solid transparent',
                transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)', // Apple's preferred easing
                '&:hover': {
                  bgcolor:
                    selectedRating === index
                      ? '#0442BF'
                      : 'rgba(4, 66, 191, 0.08)',
                  transform: 'scale(1.05)', // Subtle hover animation
                },
                '&:active': {
                  transform: 'scale(0.95)', // Apple-style press feedback
                },
                // Enhanced touch feedback for mobile
                '@media (hover: none)': {
                  '&:hover': {
                    bgcolor:
                      selectedRating === index ? '#0442BF' : 'transparent',
                    transform: 'none',
                  },
                  '&:active': {
                    bgcolor:
                      selectedRating === index
                        ? '#0442BF'
                        : 'rgba(4, 66, 191, 0.12)',
                    transform: 'scale(0.95)',
                  },
                },
              }}
              onClick={() => setSelectedRating(index)}
            >
              <Image
                src={image}
                alt={`Rating ${index + 1}`}
                width={imageSize}
                height={imageSize}
                style={{
                  height: imageSize,
                  width: imageSize,
                  objectFit: 'contain',
                }}
              />
            </IconButton>

            {/* Labels with responsive typography */}
            {index === 0 && (
              <span className="text-xs font-medium text-primary-60 sm:text-sm">
                {rateLowestText}
              </span>
            )}
            {index === 4 && (
              <span className="text-xs font-medium text-primary-60 sm:text-sm">
                {rateHighestText}
              </span>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Rate;
