import { Box } from '@mui/material';
import clsx from 'clsx';

type TimeSlot = {
  time: string;
  day: number;
};

type AvailableScheduleProps = {
  onSelectTime: (time: string, day: number) => void;
  selectedTimes: { startTime: string; dayOfWeek: number }[];
  currentDay: number;
};

const timeSlots = {
  morning: [
    { time: '06:00', day: 0 },
    { time: '06:30', day: 0 },
    { time: '07:00', day: 0 },
    { time: '07:30', day: 0 },
    { time: '08:00', day: 0 },
    { time: '08:30', day: 0 },
    { time: '09:00', day: 0 },
    { time: '09:30', day: 0 },
    { time: '10:00', day: 0 },
    { time: '10:30', day: 0 },
    { time: '11:00', day: 0 },
    { time: '11:30', day: 0 },
  ],
  afternoon: [
    { time: '12:00', day: 0 },
    { time: '12:30', day: 0 },
    { time: '13:00', day: 0 },
    { time: '13:30', day: 0 },
    { time: '14:00', day: 0 },
    { time: '14:30', day: 0 },
    { time: '15:00', day: 0 },
    { time: '15:30', day: 0 },
    { time: '16:00', day: 0 },
    { time: '16:30', day: 0 },
    { time: '17:00', day: 0 },
    { time: '17:30', day: 0 },
  ],
  evening: [
    { time: '18:00', day: 0 },
    { time: '18:30', day: 0 },
    { time: '19:00', day: 0 },
    { time: '19:30', day: 0 },
    { time: '20:00', day: 0 },
    { time: '20:30', day: 0 },
    { time: '21:00', day: 0 },
    { time: '21:30', day: 0 },
    { time: '22:00', day: 0 },
    { time: '22:30', day: 0 },
    { time: '23:00', day: 0 },
    { time: '23:30', day: 0 },
  ],
};

// Helper function to generate time slots for all 7 days
const generateTimeSlotsForWeek = () => {
  const daysOfWeek = [0, 1, 2, 3, 4, 5, 6]; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const result: typeof timeSlots = { morning: [], afternoon: [], evening: [] };

  daysOfWeek.forEach((day) => {
    Object.entries(timeSlots).forEach(([period, slots]) => {
      slots.forEach((slot) => {
        result[period as keyof typeof timeSlots].push({
          ...slot,
          day,
        });
      });
    });
  });

  return result;
};

const AvailableSchedule = ({
  onSelectTime,
  selectedTimes,
  currentDay,
}: AvailableScheduleProps) => {
  const timeSlotsForWeek = generateTimeSlotsForWeek();

  return (
    <>
      {Object.entries(timeSlotsForWeek).map(
        ([period, slots]: [string, TimeSlot[]]) => {
          const filteredSlots = slots.filter(
            (slot: TimeSlot) => slot.day === currentDay,
          );
          return (
            <div
              key={period}
              className="flex flex-col gap-2 rounded-lg bg-neutral-98 p-2"
            >
              <div className="flex flex-wrap justify-between gap-1">
                {filteredSlots.map((slot: TimeSlot) => (
                  <Box
                    key={`${slot.day}-${slot.time}`}
                    onClick={() => onSelectTime(slot.time, slot.day)}
                    className={clsx(
                      'w-[70px] cursor-pointer rounded-full py-1 text-center text-sm',
                      selectedTimes.some(
                        (s: { startTime: string; dayOfWeek: number }) =>
                          s.startTime === slot.time && s.dayOfWeek === slot.day,
                      )
                        ? 'bg-green-90 text-green-30'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 ',
                    )}
                  >
                    {slot.time}
                  </Box>
                ))}
              </div>
            </div>
          );
        },
      )}
    </>
  );
};

export default AvailableSchedule;
