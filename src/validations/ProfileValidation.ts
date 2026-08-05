import { z } from 'zod';

// The backend validates phone numbers with class-validator's
// @IsPhoneNumber() (no region argument), which only accepts full E.164
// format — a leading "+" followed by the country code (works globally,
// including Vietnam's +84). A bare national number like "0912345678"
// always fails there, so the frontend must require the same shape before
// ever submitting, in both the native `pattern` attribute and here.
export const PHONE_NUMBER_REGEX = /^\+[1-9]\d{1,3}[ -]?\d{6,14}$/;
// Translation keys (Common namespace) — not display text. Callers render
// these through next-intl's t() at the point they're shown, the same way
// ProfileForm.tsx already does for backend error codes.
export const PHONE_NUMBER_MESSAGE = 'phone_number_invalid';
export const PARENT_PHONE_NUMBER_REQUIRED_MESSAGE = 'parent_phone_number_required';

export const DateOfBirthFieldsetValidation = z.object({
  day: z.number().min(1).max(31),
  month: z.number().min(1).max(12),
  year: z.number().min(1),
});

export const ProfileValidation = z
  .object({
    fullName: z.string().trim().min(1),
    birthday: z.string().trim().min(1),
    email: z.string().trim().min(1).email(),
    gender: z.object({
      id: z.number().min(1).max(3),
      name: z.string().trim().min(1).optional(),
    }),
    phoneNumber: z.string().optional()
      .refine(value => !value || PHONE_NUMBER_REGEX.test(value), { message: PHONE_NUMBER_MESSAGE }),
    address: z.string(),
    isUnderGuard: z.boolean(),
    parentPhoneNumber: z.string().optional()
      .refine(value => !value || PHONE_NUMBER_REGEX.test(value), { message: PHONE_NUMBER_MESSAGE }),
    parentFullname: z.string().optional(),
  })
  .superRefine((values, context) => {
    if (
      values.isUnderGuard
      && (!values.parentPhoneNumber || values.parentPhoneNumber.length <= 0)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: PARENT_PHONE_NUMBER_REQUIRED_MESSAGE,
        path: ['parentPhoneNumber'],
      });
    }
  });

export const WorkExperienceValidation = z.object({
  position: z.string().trim().min(1),
  company: z.string().trim().min(1),
  startedAt: z.string().trim().min(1),
  endedAt: z.string().optional(),
});

export const EducationValidation = z.object({
  major: z.string().trim().min(1),
  institution: z.string().trim().min(1),
  startedAt: z.string().trim().min(1),
  endedAt: z.string().optional(),
  type: z.string().optional(),
  isPublic: z.boolean().optional(),
});
