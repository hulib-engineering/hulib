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

  it('accepts a guardian email in email mode, rejects a stale phone', () => {
    expect(ProfileValidation.safeParse({ ...base, countryCode: 'email', parentEmail: 'p@b.co' }).success).toBe(true);
    expect(ProfileValidation.safeParse({ ...base, countryCode: 'email', parentPhoneNumber: '+84901234567' }).success).toBe(false);
  });
});
