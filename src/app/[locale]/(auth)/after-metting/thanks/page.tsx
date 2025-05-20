'use client';

import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import hulibThanks from '@/public/assets/images/afterMetting/hulib_thanks_image.png';

export default function FeedbackConfirmationPage() {
  const t = useTranslations('thanks_page');
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#FFF5F9',
          height: '76vh',
          borderRadius: 4,
        }}
      >
        <Box
          sx={{
            width: 240,
            height: 240,
            position: 'relative',
            mb: 3,
          }}
        >
          <Image
            src={hulibThanks}
            alt="Thank you character"
            fill
            style={{ objectFit: 'contain' }}
          />
        </Box>

        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 'medium',
            color: '#4CAF50',
            mb: 2,
          }}
        >
          {t('thank_you')}
        </Typography>

        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          {t('feedback_value')}
        </Typography>

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            sx={{
              borderRadius: 28,
              px: 3,
              borderColor: '#3f51b5',
              color: '#3f51b5',
              '&:hover': {
                borderColor: '#303f9f',
              },
            }}
          >
            {t('go_to_schedule')}
          </Button>
          <Button
            component={Link}
            href="/home"
            variant="contained"
            sx={{
              borderRadius: 28,
              px: 3,
              backgroundColor: '#3f51b5',
              '&:hover': {
                backgroundColor: '#303f9f',
              },
            }}
          >
            {t('back_to_home')}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
