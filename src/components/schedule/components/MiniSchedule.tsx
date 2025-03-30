import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import type { PickersCalendarHeaderProps } from '@mui/x-date-pickers/PickersCalendarHeader';
import type { Dayjs } from 'dayjs';
import { useCallback } from 'react';

const CustomCalendarHeaderRoot = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '8px 16px',
  alignItems: 'center',
});

function CustomCalendarHeader(props: PickersCalendarHeaderProps<Dayjs>) {
  const { currentMonth, onMonthChange } = props;

  const handleMonthChange = useCallback(
    (amount: number, unit: 'month' | 'year', direction: 'left' | 'right') => {
      if (onMonthChange) {
        onMonthChange(currentMonth.add(amount, unit), direction);
      }
    },
    [currentMonth, onMonthChange],
  );

  return (
    <CustomCalendarHeaderRoot>
      <Stack spacing={1} direction="row">
        <IconButton
          onClick={() => handleMonthChange(-1, 'month', 'right')}
          title="Previous month"
        >
          <ChevronLeft />
        </IconButton>
      </Stack>
      <Typography variant="body2">
        {currentMonth.format('MMMM YYYY')}
      </Typography>
      <Stack spacing={1} direction="row">
        <IconButton
          onClick={() => handleMonthChange(1, 'month', 'left')}
          title="Next month"
        >
          <ChevronRight />
        </IconButton>
      </Stack>
    </CustomCalendarHeaderRoot>
  );
}

type Props = {
  selectedDate?: Dayjs | null;
  setSelectedDate?: (value: Dayjs) => void;
};

export default function MiniSchedule({ selectedDate, setSelectedDate }: Props) {
  return (
    <div className="my-[20px] rounded-[12px] bg-[#fff] drop-shadow-md">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          disablePast
          value={selectedDate}
          onChange={setSelectedDate}
          slots={{ calendarHeader: CustomCalendarHeader }}
          slotProps={{
            day: {
              sx: {
                '&.MuiPickersDay-root': {
                  borderRadius: '4px',
                },
                '&.MuiPickersDay-today': {
                  borderRadius: '4px',
                },
                '&.Mui-selected': {
                  backgroundColor: '#007bff',
                  color: 'white',
                  borderRadius: '4px',
                },
                '&.Mui-selected:hover': {
                  backgroundColor: '#0056b3',
                  borderRadius: '4px',
                },
              },
            },
          }}
        />
      </LocalizationProvider>
    </div>
  );
}
