export type TimeSlotItem = {
  startTime: string;
  dayOfWeek: number;
};

export type TimeSlots = {
  morning: TimeSlotItem[];
  afternoon: TimeSlotItem[];
  evening: TimeSlotItem[];
};
