export const genders = [
  { value: 1, label: 'Male' },
  { value: 2, label: 'Female' },
  { value: 3, label: 'Other' },
];

export const publicRoutes = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
};

export const POPULAR_TIMEZONES = [
  'America/Los_Angeles',
  'America/New_York',
  'America/Chicago',
  'America/Toronto',
  'America/Sao_Paulo',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Madrid',
  'Europe/Moscow',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Bangkok',
  'Asia/Ho_Chi_Minh',
  'Asia/Singapore',
  'Asia/Shanghai',
  'Asia/Hong_Kong',
  'Asia/Tokyo',
  'Asia/Seoul',
  'Australia/Sydney',
  'Pacific/Auckland',
];

export const TZ_ABBREVS: Record<string, string> = {
  // 🌎 North America
  'America/New_York': 'EST/EDT',
  'America/Chicago': 'CST/CDT',
  'America/Denver': 'MST/MDT',
  'America/Los_Angeles': 'PST/PDT',
  'America/Toronto': 'EST/EDT',
  'America/Vancouver': 'PST/PDT',
  'America/Mexico_City': 'CST/CDT',

  // 🌍 Europe
  'Europe/London': 'GMT/BST',
  'Europe/Dublin': 'GMT/IST',
  'Europe/Paris': 'CET/CEST',
  'Europe/Berlin': 'CET/CEST',
  'Europe/Madrid': 'CET/CEST',
  'Europe/Rome': 'CET/CEST',
  'Europe/Amsterdam': 'CET/CEST',
  'Europe/Brussels': 'CET/CEST',
  'Europe/Warsaw': 'CET/CEST',
  'Europe/Athens': 'EET/EEST',
  'Europe/Moscow': 'MSK', // no DST

  // 🌏 Asia
  'Asia/Ho_Chi_Minh': 'ICT',
  'Asia/Saigon': 'ICT',
  'Asia/Bangkok': 'ICT',
  'Asia/Jakarta': 'WIB',
  'Asia/Shanghai': 'CST',
  'Asia/Hong_Kong': 'HKT',
  'Asia/Tokyo': 'JST',
  'Asia/Seoul': 'KST',
  'Asia/Taipei': 'CST',
  'Asia/Singapore': 'SGT',
  'Asia/Kuala_Lumpur': 'MYT',
  'Asia/Manila': 'PHT',
  'Asia/Kolkata': 'IST',
  'Asia/Dubai': 'GST',
  'Asia/Riyadh': 'AST',
  'Asia/Tehran': 'IRST/IRDT',

  // 🌏 Oceania
  'Australia/Sydney': 'AEST/AEDT',
  'Australia/Melbourne': 'AEST/AEDT',
  'Australia/Brisbane': 'AEST', // no DST
  'Australia/Perth': 'AWST',
  'Pacific/Auckland': 'NZST/NZDT',

  // 🌍 South America
  'America/Sao_Paulo': 'BRT/BRST',
  'America/Argentina/Buenos_Aires': 'ART',
  'America/Bogota': 'COT',
  'America/Lima': 'PET',
  'America/Santiago': 'CLT/CLST',

  // 🌍 Africa
  'Africa/Cairo': 'EET',
  'Africa/Johannesburg': 'SAST',
  'Africa/Nairobi': 'EAT',
};
