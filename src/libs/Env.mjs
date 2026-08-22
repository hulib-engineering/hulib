import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

// Don't add NODE_ENV into T3 Env, it changes the tree-shaking behavior
export const Env = createEnv({
  server: {
    CLIENT_EMAIL: z.string().min(1).optional(),
    CLIENT_ID: z.string().min(1).optional(),
    PRIVATE_KEY: z.string().min(1).optional(),
    SPREADSHEET_ID: z.string().min(1).optional(),
    CLOUDINARY_API_KEY: z.string().min(1).optional(),
    CLOUDINARY_API_SECRET: z.string().min(1).optional(),
    FACEBOOK_ID: z.string().min(1).optional(),
    FACEBOOK_SECRET: z.string().min(1).optional(),
    GOOGLE_ID: z.string().min(1).optional(),
    GOOGLE_SECRET: z.string().min(1).optional(),
    NEXTAUTH_SECRET: z.string().min(1).optional(),
    LOGTAIL_SOURCE_TOKEN: z.string().optional(),
    GG_FONTS_API_KEY: z.string().min(1).optional(),
  },
  client: {
    NEXT_PUBLIC_REACT_APP_BACKEND_VERSION: z.string().trim().min(1),
    NEXT_PUBLIC_REACT_APP_BACKEND_ENDPOINT: z.string().trim().min(1),
    NEXT_PUBLIC_REACT_APP_BACKEND_SOCKET_ENDPOINT: z.string().trim().min(1),
    NEXT_PUBLIC_EMAILJS_SERVICE_ID: z.string().trim().min(1),
    NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: z.string().trim().min(1),
    NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: z.string().trim().min(1),
    NEXT_PUBLIC_CONTACT_EMAIL: z.string().trim().email(),
    NEXT_PUBLIC_CONTACT_PHONE_NUMBER: z.string().trim().min(9),
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().trim().min(9),
    NEXT_PUBLIC_UPLOAD_PRESET: z.string().trim().min(9),
    NEXT_PUBLIC_AGORA_APP_ID: z.string().trim().min(1),
    NEXT_PUBLIC_APP_URL: z.string().trim().min(1),
  },
  shared: {
    NODE_ENV: z.enum(['test', 'development', 'production']).optional(),
  },
  // You need to destructure all the keys manually
  runtimeEnv: {
    // Right-hand side is the real process.env source; left-hand keys are
    // the Env.* names the rest of the app already uses, unchanged. Only the
    // source var names carry the FE_ prefix (shared Key Vault convention,
    // distinguishing frontend secrets from the backend's BE_ ones).
    CLIENT_EMAIL: process.env.FE_CLIENT_EMAIL,
    CLIENT_ID: process.env.FE_CLIENT_ID,
    PRIVATE_KEY: process.env.FE_PRIVATE_KEY,
    SPREADSHEET_ID: process.env.FE_SPREADSHEET_ID,
    CLOUDINARY_API_KEY: process.env.FE_CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.FE_CLOUDINARY_API_SECRET,
    FACEBOOK_ID: process.env.FE_FACEBOOK_ID,
    FACEBOOK_SECRET: process.env.FE_FACEBOOK_SECRET,
    GOOGLE_ID: process.env.FE_GOOGLE_ID,
    GOOGLE_SECRET: process.env.FE_GOOGLE_SECRET,
    NEXTAUTH_SECRET: process.env.FE_NEXTAUTH_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    GG_FONTS_API_KEY: process.env.FE_GG_FONTS_API_KEY,
    NEXT_PUBLIC_REACT_APP_BACKEND_VERSION:
      process.env.NEXT_PUBLIC_REACT_APP_BACKEND_VERSION,
    NEXT_PUBLIC_REACT_APP_BACKEND_ENDPOINT:
      process.env.NEXT_PUBLIC_REACT_APP_BACKEND_ENDPOINT,
    NEXT_PUBLIC_REACT_APP_BACKEND_SOCKET_ENDPOINT:
      process.env.NEXT_PUBLIC_REACT_APP_BACKEND_SOCKET_ENDPOINT,
    NEXT_PUBLIC_EMAILJS_SERVICE_ID: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
    NEXT_PUBLIC_EMAILJS_TEMPLATE_ID:
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
    NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
    NEXT_PUBLIC_CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
    NEXT_PUBLIC_CONTACT_PHONE_NUMBER:
      process.env.NEXT_PUBLIC_CONTACT_PHONE_NUMBER,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    NEXT_PUBLIC_UPLOAD_PRESET: process.env.NEXT_PUBLIC_UPLOAD_PRESET,
    LOGTAIL_SOURCE_TOKEN: process.env.FE_LOGTAIL_SOURCE_TOKEN,
    NEXT_PUBLIC_AGORA_APP_ID: process.env.NEXT_PUBLIC_AGORA_APP_ID,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
});
