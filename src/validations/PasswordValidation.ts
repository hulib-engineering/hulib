import type { RuleNames } from 'react-password-checklist';
import { z } from 'zod';

export const PASSWORD_MIN_LENGTH = 8;

// Single source of truth for "strong password" rules, shared by every zod
// schema that validates a new password (register, reset, change) and by the
// <PasswordChecklist> rules below. Keeping them in one place means the
// checklist the user sees can never silently drift out of sync with what the
// form will actually accept on submit.
export const passwordSchema = z
  .string()
  .trim()
  .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`)
  .refine(password => /[A-Z]/.test(password), 'Password must contain an uppercase letter')
  .refine(password => /\d/.test(password), 'Password must contain a number')
  .refine(password => /[!@#$%^&*]/.test(password), 'Password must contain a special character (!@#$%^&*)');

// react-password-checklist rules mirroring passwordSchema exactly — one rule
// per .refine()/.min() above, in the order they're shown to the user.
export const PASSWORD_CHECKLIST_RULES: RuleNames[] = [
  'minLength',
  'specialChar',
  'number',
  'capital',
  'match',
];
