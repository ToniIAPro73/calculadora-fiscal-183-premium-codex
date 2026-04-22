import { DayPicker, type DayPickerProps } from 'react-day-picker';
import { cn } from '@/lib/utils';

export function Calendar({ className, classNames, showOutsideDays = true, ...props }: DayPickerProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        month: 'space-y-4',
        months: 'flex flex-col gap-4 sm:flex-row',
        caption: 'flex items-center justify-center pt-1 relative',
        nav: 'flex items-center gap-1',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        row: 'mt-2 flex w-full',
        cell: 'relative h-9 w-9 p-0 text-center text-sm',
        day: 'h-9 w-9 rounded-md hover:bg-accent hover:text-accent-foreground',
        ...classNames,
      }}
      {...props}
    />
  );
}
