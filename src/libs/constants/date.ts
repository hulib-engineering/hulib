export const MORNING_TIME_START: number = 6;
export const AFTERNOON_TIME_START: number = 12;
export const EVENING_TIME_START: number = 18;

export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const; // TODO: wrap translation function around the days

function generateSlots(startHour: number, endHour: number): string[] {
  const slots: string[] = [];
  for (let h = startHour; h < endHour; h++) {
    const displayHour = h % 12 === 0 ? 12 : h % 12;
    const period = h < 12 ? 'AM' : 'PM';
    slots.push(`${displayHour}:00 ${period}`);
    slots.push(`${displayHour}:30 ${period}`);
  }
  return slots;
}

export const TIME_SLOTS = {
  morning: generateSlots(6, 12),
  afternoon: generateSlots(12, 18),
  evening: generateSlots(18, 24),
};

export const DAY_KEYS = [
  { short: 'day_short_1', full: 'day_full_1', prompt: 'day_prompt_1' },
  { short: 'day_short_2', full: 'day_full_2', prompt: 'day_prompt_2' },
  { short: 'day_short_3', full: 'day_full_3', prompt: 'day_prompt_3' },
  { short: 'day_short_4', full: 'day_full_4', prompt: 'day_prompt_4' },
  { short: 'day_short_5', full: 'day_full_5', prompt: 'day_prompt_5' },
  { short: 'day_short_6', full: 'day_full_6', prompt: 'day_prompt_6' },
  { short: 'day_short_0', full: 'day_full_0', prompt: 'day_prompt_0' },
] as const;
