export type PhoneCountry = 'VN' | 'US';

export const detectPhoneCountry = (phone?: string): PhoneCountry | string => {
  if (!phone) {
    return 'email';
  }

  let s = phone.trim().replace(/[\s().-]/g, '');

  if (s.startsWith('+')) {
    s = s.slice(1);
  } else if (s.startsWith('00')) {
    s = s.slice(2);
  } else if (s.startsWith('0')) {
    return 'VN';
  } // local VN format (0901234567)

  if (!/^\d+$/.test(s)) {
    return 'email';
  }

  if (s.startsWith('84') && s.length >= 11) {
    return 'VN';
  } // 84 + 9-10 digits
  if (s.startsWith('1') && s.length === 11) {
    return 'US';
  } // 1 + 10 digits
  if (s.length === 10 && /^[2-9]/.test(s)) {
    return 'US';
  } // US national (area code 2-9)

  return 'email';
};
