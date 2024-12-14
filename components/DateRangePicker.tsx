import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from '@/lib/types';
import { format } from 'date-fns';

interface DateRangePickerProps {
  date: DateRange;
  onSelect: (range: DateRange) => void;
}

export function DateRangePicker({ date, onSelect }: DateRangePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="bg-gray-900/50 border-gray-800 text-white">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-gray-900 border-gray-800" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date.from}
          selected={{ from: date.from, to: date.to }}
          onSelect={(range) => range && onSelect(range)}
          numberOfMonths={2}
          className="text-white"
        />
      </PopoverContent>
    </Popover>
  );
}