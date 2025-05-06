export enum Gender {
  MALE = 1,
  FEMALE = 2,
  OTHER = 3,
}

export const GenderName = {
  [Gender.MALE]: 'Male',
  [Gender.FEMALE]: 'Female',
  [Gender.OTHER]: 'Other',
} as const;
