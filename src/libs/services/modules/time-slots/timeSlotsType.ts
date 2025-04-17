export interface TimeSlotItem {
  startTime: string;
  dayOfWeek: number;
}

export interface TimeSlots {
  morning: TimeSlotItem[];
  afternoon: TimeSlotItem[];
  evening: TimeSlotItem[];
}
