import { getSafetyRequirement } from './profile.util';
import { ProfileValidation } from '@/validations/ProfileValidation';

const yearsAgo = (years: number) => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - years);
  return date.toISOString().slice(0, 10);
};

describe('getSafetyRequirement', () => {
  it('asks for a birthday when missing', () => {
    expect(getSafetyRequirement({ birthday: null })).toBe('birthday');
    expect(getSafetyRequirement(null)).toBe('birthday');
  });

  it('asks for a guardian when under 18 without any contact', () => {
    expect(getSafetyRequirement({ birthday: yearsAgo(15) })).toBe('guardian');
  });

  it('accepts either a guardian phone or email', () => {
    expect(getSafetyRequirement({ birthday: yearsAgo(15), parentPhoneNumber: '+84901234567' })).toBeNull();
    expect(getSafetyRequirement({ birthday: yearsAgo(15), parentEmail: 'a@b.co' })).toBeNull();
  });

  it('lets adults through', () => {
    expect(getSafetyRequirement({ birthday: yearsAgo(30) })).toBeNull();
  });
});

describe('ProfileValidation guardian rule', () => {
  const base = {
    fullName: 'A',
    birthday: yearsAgo(15),
    email: 'a@b.co',
    gender: { id: 1 },
    address: '',
    isUnderGuard: true,
    countryCode: '+84',
    parentPhoneNumber: null,
    parentEmail: null,
  };

  it('requires a guardian contact when under 18', () => {
    expect(ProfileValidation.safeParse(base).success).toBe(false);
  });

  it('puts the guardian_required error on the field of the selected contact kind', () => {
    const pathOf = (input: object) => {
      const result = ProfileValidation.safeParse(input);
      return result.success ? null : result.error.issues.map(issue => issue.path.join('.'));
    };

    expect(pathOf({ ...base, countryCode: 'email' })).toEqual(['parentEmail']);
    expect(pathOf({ ...base, countryCode: '+84' })).toEqual(['parentPhoneNumber']);
  });

  it('accepts a guardian email in email mode, rejects a stale phone', () => {
    expect(ProfileValidation.safeParse({ ...base, countryCode: 'email', parentEmail: 'p@b.co' }).success).toBe(true);
    expect(ProfileValidation.safeParse({ ...base, countryCode: 'email', parentPhoneNumber: '+84901234567' }).success).toBe(false);
  });

  it('strips whitespace from the phone number before validating and returning it', () => {
    const result = ProfileValidation.safeParse({ ...base, isUnderGuard: false, phoneNumber: ' +84 901 234 567 ' });

    expect(result.success && result.data.phoneNumber).toBe('+84901234567');
  });

  it('only checks the email format while the email kind is selected', () => {
    const invalid = { ...base, isUnderGuard: false, parentEmail: 'not-an-email' };
    const result = ProfileValidation.safeParse({ ...invalid, countryCode: 'email' });

    expect(!result.success && result.error.issues.map(issue => [issue.path.join('.'), issue.message])).toEqual([['parentEmail', 'email_invalid']]);
    expect(ProfileValidation.safeParse({ ...invalid, countryCode: 'VN' }).success).toBe(true);
  });

  it('strips whitespace from the guardian phone and trims the guardian email', () => {
    const phone = ProfileValidation.safeParse({ ...base, countryCode: 'VN', parentPhoneNumber: ' 0901 234 567 ' });
    const email = ProfileValidation.safeParse({ ...base, countryCode: 'email', parentEmail: ' p@b.co ' });

    expect(phone.success && phone.data.parentPhoneNumber).toBe('0901234567');
    expect(email.success && email.data.parentEmail).toBe('p@b.co');
    expect(ProfileValidation.safeParse({ ...base, countryCode: 'VN', parentPhoneNumber: '   ' }).success).toBe(false);
  });
});
